<?php

namespace App\Http\Controllers;

use App\User;
use App\Services\DatabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class SuperAdminController extends Controller
{
    /**
     * Get all users with pagination
     */
    public function getUsers()
    {
        $users = User::paginate(20);

        // Enrich with cached plain passwords
        $users->getCollection()->transform(function ($user) {
            $plainPassword = Cache::get("user_password_{$user->id}");
            $user->password = $plainPassword ?: null;
            return $user;
        });

        return response()->json($users);
    }

    /**
     * Create a new user (admin or company)
     * Admin users get their own dedicated database
     */
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,company',
            'company_name' => 'nullable|string|max:255', // For company role
        ]);

        $plainPassword = $validated['password'];

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            // If admin role, create dedicated database
            if ($validated['role'] === 'admin') {
                $databaseName = DatabaseService::generateDatabaseName($user->id, $user->email);

                try {
                    // Create the database and run migrations
                    DatabaseService::createAdminDatabase($databaseName);

                    // Update user with database name
                    $user->update([
                        'database_name' => $databaseName,
                        'database_created_at' => now(),
                    ]);

                    \Log::info("Admin database created: {$databaseName} for user {$user->email}");
                } catch (\Exception $dbError) {
                    \Log::error("Failed to create admin database: " . $dbError->getMessage());
                    throw new \Exception("Database creation failed: " . $dbError->getMessage());
                }
            }

            // Cache plain password for 24 hours
            Cache::put("user_password_{$user->id}", $plainPassword, 86400);

            DB::commit();

            $response = [
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $plainPassword,
                    'role' => $user->role,
                    'database_name' => $user->database_name ?? null,
                    'created_at' => $user->created_at,
                ],
            ];

            // Add detailed message based on role
            if ($validated['role'] === 'admin') {
                $response['message'] = "✅ Admin berhasil dibuat!";
                $response['details'] = "Database '{$user->database_name}' telah berhasil dibuat dan siap digunakan.";
                $response['notification'] = [
                    'type' => 'success',
                    'title' => '✅ Admin Berhasil Dibuat',
                    'message' => "Admin {$user->name} ({$user->email}) telah dibuat dengan database isolated: {$user->database_name}",
                    'duration' => 5000,
                ];
            } else {
                $response['message'] = "User berhasil dibuat";
                $response['notification'] = [
                    'type' => 'success',
                    'title' => '✅ User Berhasil Dibuat',
                    'message' => "User {$user->name} ({$user->email}) telah dibuat",
                    'duration' => 5000,
                ];
            }

            return response()->json($response, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Create user failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat user',
                'error' => $e->getMessage(),
                'notification' => [
                    'type' => 'error',
                    'title' => '❌ Gagal Membuat User',
                    'message' => $e->getMessage(),
                    'duration' => 5000,
                ],
            ], 500);
        }
    }

    /**
     * Delete a user and their database (if admin)
     */
    public function deleteUser($userId)
    {
        try {
            DB::beginTransaction();

            $user = User::find($userId);
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not found'], 404);
            }

            // If admin, delete their database
            if ($user->role === 'admin' && $user->database_name) {
                DatabaseService::deleteAdminDatabase($user->database_name);
            }

            $user->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $user->role === 'admin'
                    ? "Admin user and database deleted successfully"
                    : 'User deleted successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get database statistics
     */
    public function getStats()
    {
        try {
            // Force use master database for super admin stats
            $originalConnection = config('database.default');
            config(['database.default' => 'mysql']);
            DB::reconnect();

            $stats = [
                'total_users' => DB::table('users')->count(),
                'total_admins' => DB::table('users')->where('role', 'admin')->count(),
                'total_companies' => DB::table('users')->where('role', 'company')->count(),
                'total_alumni_users' => DB::table('users')->where('role', 'alumni')->count(),
                'total_alumni' => DB::table('alumni')->count(),
                'total_messages' => DB::table('messages')->count(),
                'total_job_postings' => DB::table('job_postings')->count(),
                'total_applications' => DB::table('job_applications')->count(),
                'users_by_role' => DB::table('users')
                    ->groupBy('role')
                    ->selectRaw('role, count(*) as count')
                    ->get(),
            ];

            // Restore original connection
            config(['database.default' => $originalConnection]);
            DB::reconnect();

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching stats: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get admin databases info
     */
    public function getAdminDatabases()
    {
        try {
            $admins = User::where('role', 'admin')
                ->where('database_name', '!=', null)
                ->select('id', 'name', 'email', 'database_name', 'database_created_at')
                ->get();

            $databases = $admins->map(function ($admin) {
                $size = DatabaseService::getDatabaseSize($admin->database_name);
                return [
                    'admin_id' => $admin->id,
                    'admin_name' => $admin->name,
                    'admin_email' => $admin->email,
                    'database_name' => $admin->database_name,
                    'database_created_at' => $admin->database_created_at,
                    'size_mb' => $size,
                    'exists' => DatabaseService::databaseExists($admin->database_name),
                ];
            });

            return response()->json([
                'success' => true,
                'total_admin_databases' => $databases->count(),
                'databases' => $databases,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching database info: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear all data in main database (not admin databases)
     */
    public function clearAllData()
    {
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            DB::table('messages')->truncate();
            DB::table('job_applications')->truncate();
            DB::table('job_postings')->truncate();
            DB::table('documents')->truncate();
            DB::table('alumni')->truncate();

            // Keep users table to preserve admin accounts with their databases
            // Only clear non-admin users
            DB::table('users')->where('role', '!=', 'admin')->delete();

            DB::statement('SET FOREIGN_KEY_CHECKS=1');

            return response()->json([
                'success' => true,
                'message' => 'All data cleared successfully (admin accounts preserved)',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error clearing data: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all alumni from all admin databases AND master database
     */
    public function getAllAlumni()
    {
        try {
            $allAlumni = [];

            // First, get alumni from master database (for old admin accounts without database_name)
            try {
                $masterAlumni = DB::connection('mysql')->table('alumni')
                    ->select('id', 'name', 'email', 'major', 'graduation_year', 'status', 'skills', 'created_at')
                    ->get();

                foreach ($masterAlumni as $alum) {
                    $allAlumni[] = [
                        'id' => $alum->id,
                        'name' => $alum->name,
                        'email' => $alum->email,
                        'major' => $alum->major,
                        'graduation_year' => $alum->graduation_year,
                        'status' => $alum->status,
                        'skills' => $alum->skills ? json_decode($alum->skills) : [],
                        'created_at' => $alum->created_at,
                        'admin_name' => 'Master Database',
                        'source_database' => 'mysql (master)',
                    ];
                }
            } catch (\Exception $e) {
                \Log::error("Error fetching alumni from master database: " . $e->getMessage());
            }

            // Then, get all admin users with databases
            $admins = User::where('role', 'admin')
                ->where('database_name', '!=', null)
                ->get();

            foreach ($admins as $admin) {
                $databaseName = $admin->database_name;

                if (DatabaseService::databaseExists($databaseName)) {
                    try {
                        // Create dynamic connection
                        DatabaseService::createConnection($databaseName);

                        $alumni = DB::connection($databaseName)->table('alumni')
                            ->select('id', 'name', 'email', 'major', 'graduation_year', 'status', 'skills', 'created_at')
                            ->get();

                        foreach ($alumni as $alum) {
                            $allAlumni[] = [
                                'id' => $alum->id,
                                'name' => $alum->name,
                                'email' => $alum->email,
                                'major' => $alum->major,
                                'graduation_year' => $alum->graduation_year,
                                'status' => $alum->status,
                                'skills' => $alum->skills ? json_decode($alum->skills) : [],
                                'created_at' => $alum->created_at,
                                'admin_name' => $admin->name,
                                'source_database' => $databaseName,
                            ];
                        }
                    } catch (\Exception $e) {
                        \Log::error("Error fetching alumni from {$databaseName}: " . $e->getMessage());
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => $allAlumni,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching alumni: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all messages
     */
    public function getAllMessages()
    {
        try {
            // Get all messages from master database
            $messages = DB::connection('mysql')->table('messages')
                ->select(
                    'messages.id',
                    'messages.sender_id',
                    'messages.receiver_id',
                    'messages.message as content',
                    'messages.status',
                    'messages.is_read',
                    'messages.created_at'
                )
                ->orderBy('messages.created_at', 'desc')
                ->get();

            // Get sender and receiver names
            $enrichedMessages = $messages->map(function($message) {
                $sender = DB::connection('mysql')->table('users')->where('id', $message->sender_id)->first();
                $receiver = DB::connection('mysql')->table('users')->where('id', $message->receiver_id)->first();

                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'sender_name' => $sender ? $sender->name : 'Unknown',
                    'receiver_name' => $receiver ? $receiver->name : 'Unknown',
                    'content' => $message->content,
                    'status' => $message->status,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $enrichedMessages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching messages: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all job postings
     */
    public function getAllJobPostings()
    {
        try {
            // Get job postings from master database
            $jobPostings = DB::connection('mysql')->table('job_postings')
                ->select(
                    'job_postings.id',
                    'job_postings.company_id',
                    'job_postings.title',
                    'job_postings.description',
                    'job_postings.location',
                    'job_postings.salary_range',
                    'job_postings.created_at'
                )
                ->orderBy('job_postings.created_at', 'desc')
                ->get();

            // Get company names
            $enrichedJobPostings = $jobPostings->map(function($job) {
                $company = DB::connection('mysql')->table('users')
                    ->where('id', $job->company_id)
                    ->where('role', 'company')
                    ->first();

                return [
                    'id' => $job->id,
                    'company_id' => $job->company_id,
                    'company_name' => $company ? $company->name : 'Unknown',
                    'title' => $job->title,
                    'description' => $job->description,
                    'location' => $job->location,
                    'salary_range' => $job->salary_range,
                    'created_at' => $job->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $enrichedJobPostings,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching job postings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all job applications from master database AND admin databases
     */
    public function getAllApplications()
    {
        try {
            $allApplications = [];

            // First, get applications from master database (for old admin accounts)
            try {
                $masterApplications = DB::connection('mysql')->table('job_applications')
                    ->select('id', 'user_id', 'alumni_id', 'job_posting_id', 'status', 'created_at')
                    ->get();

                foreach ($masterApplications as $app) {
                    // Get alumni name from master database
                    $alumni = DB::connection('mysql')->table('alumni')
                        ->where('id', $app->alumni_id)
                        ->first();

                    // Get job posting from master database
                    $job = DB::connection('mysql')->table('job_postings')
                        ->where('id', $app->job_posting_id)
                        ->first();

                    $allApplications[] = [
                        'id' => $app->id,
                        'user_id' => $app->user_id,
                        'alumni_id' => $app->alumni_id,
                        'job_posting_id' => $app->job_posting_id,
                        'alumni_name' => $alumni ? $alumni->name : 'Unknown',
                        'job_title' => $job ? $job->title : 'Unknown',
                        'status' => $app->status,
                        'created_at' => $app->created_at,
                        'admin_name' => 'Master Database',
                        'source_database' => 'mysql (master)',
                    ];
                }
            } catch (\Exception $e) {
                \Log::error("Error fetching applications from master database: " . $e->getMessage());
            }

            // Then, get all admin users with databases
            $admins = User::where('role', 'admin')
                ->where('database_name', '!=', null)
                ->get();

            foreach ($admins as $admin) {
                $databaseName = $admin->database_name;

                if (DatabaseService::databaseExists($databaseName)) {
                    try {
                        // Create dynamic connection
                        DatabaseService::createConnection($databaseName);

                        // Get applications from this admin's database
                        $applications = DB::connection($databaseName)->table('job_applications')
                            ->select('id', 'user_id', 'alumni_id', 'job_posting_id', 'status', 'created_at')
                            ->get();

                        foreach ($applications as $app) {
                            // Get alumni name from same database
                            $alumni = DB::connection($databaseName)->table('alumni')
                                ->where('id', $app->alumni_id)
                                ->first();

                            // Get job posting from master database
                            $job = DB::connection('mysql')->table('job_postings')
                                ->where('id', $app->job_posting_id)
                                ->first();

                            $allApplications[] = [
                                'id' => $app->id,
                                'user_id' => $app->user_id,
                                'alumni_id' => $app->alumni_id,
                                'job_posting_id' => $app->job_posting_id,
                                'alumni_name' => $alumni ? $alumni->name : 'Unknown',
                                'job_title' => $job ? $job->title : 'Unknown',
                                'status' => $app->status,
                                'created_at' => $app->created_at,
                                'admin_name' => $admin->name,
                                'source_database' => $databaseName,
                            ];
                        }
                    } catch (\Exception $e) {
                        \Log::error("Error fetching applications from {$databaseName}: " . $e->getMessage());
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => $allApplications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching applications: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get maintenance mode status
     */
    public function getMaintenanceStatus()
    {
        $filePath = storage_path('framework/maintenance.json');

        if (!file_exists($filePath)) {
            return response()->json([
                'maintenance_mode' => false,
            ]);
        }

        try {
            $content = file_get_contents($filePath);
            $data = json_decode($content, true);

            return response()->json([
                'maintenance_mode' => $data['enabled'] ?? false,
                'end_date' => $data['end_date'] ?? null,
                'end_time' => $data['end_time'] ?? null,
                'message' => $data['message'] ?? null,
                'updated_at' => $data['updated_at'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'maintenance_mode' => false,
            ]);
        }
    }

    /**
     * Toggle maintenance mode
     */
    public function toggleMaintenanceMode(Request $request)
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
            'end_date' => 'nullable|date',
            'end_time' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $filePath = storage_path('framework/maintenance.json');
        $enabled = $validated['enabled'];

        try {
            $data = [
                'enabled' => $enabled,
                'end_date' => $validated['end_date'] ?? null,
                'end_time' => $validated['end_time'] ?? null,
                'message' => $validated['message'] ?? null,
                'updated_at' => now()->toDateTimeString(),
            ];

            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));

            return response()->json([
                'success' => true,
                'maintenance_mode' => $enabled,
                'end_date' => $data['end_date'],
                'end_time' => $data['end_time'],
                'message' => $data['message'],
                'message' => $enabled ? 'Maintenance mode activated' : 'Maintenance mode deactivated',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error toggling maintenance mode: ' . $e->getMessage(),
            ], 500);
        }
    }
}

