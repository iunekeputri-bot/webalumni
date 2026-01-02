<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobPosting;
use App\Models\Message;
use App\Models\Alumni;
use App\Models\JobApplication;
use App\Services\DatabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['show']);
    }

    /**
     * Get current authenticated company
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Only company users can access this'], 403);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'industry' => $user->industry ?? null,
            'website' => $user->website ?? null,
            'address' => $user->address ?? null,
            'city' => $user->city ?? null,
            'description' => $user->description ?? null,
            'logo' => $user->logo ?? null,
        ]);
    }

    /**
     * Update company profile
     */
    public function updateMe(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Only company users can access this'], 403);
        }

        // Convert empty strings to null for nullable fields to prevent validation errors
        $data = $request->all();
        $nullableFields = ['phone', 'industry', 'website', 'address', 'city', 'description', 'logo'];

        foreach ($nullableFields as $field) {
            if (isset($data[$field]) && trim($data[$field]) === '') {
                $data[$field] = null;
            }
        }
        $request->merge($data);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'phone' => 'nullable|string',
            'industry' => 'nullable|string',
            'website' => 'nullable|string|url',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|string', // Base64
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Company profile updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Get company job postings
     */
    public function getJobPostings(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Only company users can access this'], 403);
        }

        $jobs = JobPosting::where('company_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($jobs);
    }

    /**
     * Get company statistics
     */
    public function getStats(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Only company users can access this'], 403);
        }

        $totalAlumni = Alumni::count();
        $activeJobs = JobPosting::where('company_id', $user->id)
            ->where('status', 'active')
            ->count();
        $totalApplications = JobApplication::whereIn(
            'job_posting_id',
            JobPosting::where('company_id', $user->id)->pluck('id')
        )->count();
        $totalMessages = Message::where('receiver_id', $user->id)->count();

        return response()->json([
            'total_alumni' => $totalAlumni,
            'active_jobs' => $activeJobs,
            'total_applications' => $totalApplications,
            'total_messages' => $totalMessages,
        ]);
    }

    /**
     * Get single company
     */
    public function show($id)
    {
        $company = User::where('id', $id)
            ->where('role', 'company')
            ->first();

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json([
            'id' => $company->id,
            'name' => $company->name,
            'email' => $company->email,
            'phone' => $company->phone,
            'industry' => $company->industry ?? null,
            'website' => $company->website ?? null,
            'description' => $company->description ?? null,
            'logo' => $company->logo ?? null,
        ]);
    }

    /**
     * Get all alumni from master database AND all admin databases
     * This is for company to view potential candidates across all schools/institutions
     */
    public function getAllAlumni(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company') {
            return response()->json(['message' => 'Only company users can access this'], 403);
        }

        try {
            $allAlumni = [];
            $search = $request->input('search');

            // First, get alumni from master database (for old admin accounts without database_name)
            try {
                $query = DB::connection('mysql')->table('alumni')
                    ->select([
                        'id',
                        'user_id',
                        'name',
                        'email',
                        'phone',
                        'major',
                        'graduation_year',
                        'status',
                        'bio',
                        'skills',
                        'work_status',
                        'avatar',
                        'birth_date',
                        'nisn',
                        'join_date',
                    ]);

                if ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('skills', 'like', "%{$search}%")
                            ->orWhere('major', 'like', "%{$search}%");
                    });
                }

                $masterAlumni = $query->get();

                foreach ($masterAlumni as $alumnus) {
                    $alumniData = (array) $alumnus;
                    $alumniData['admin_name'] = 'Master Database';
                    $alumniData['admin_email'] = 'system@alumni.com';
                    $alumniData['source_database'] = 'mysql (master)';

                    // Parse skills if it's JSON string
                    if (isset($alumniData['skills']) && is_string($alumniData['skills'])) {
                        $alumniData['skills'] = json_decode($alumniData['skills'], true) ?? [];
                    }

                    // Generate avatar URL
                    if (empty($alumniData['avatar'])) {
                        $alumniData['avatar'] = "https://avatar.vercel.sh/" . strtolower(str_replace(" ", "", $alumniData['name']));
                    } else if (!filter_var($alumniData['avatar'], FILTER_VALIDATE_URL)) {
                        $alumniData['avatar'] = url($alumniData['avatar']);
                    }

                    $allAlumni[] = $alumniData;
                }

                \Log::info("Loaded " . count($masterAlumni) . " alumni from master database");
            } catch (\Exception $e) {
                \Log::error("Error loading alumni from master database: " . $e->getMessage());
            }

            // Then, get all admin users with databases
            $admins = User::where('role', 'admin')
                ->whereNotNull('database_name')
                ->get();

            \Log::info("Found " . $admins->count() . " admin databases to query");

            foreach ($admins as $admin) {
                try {
                    $dbName = $admin->database_name;

                    if (!DatabaseService::databaseExists($dbName)) {
                        \Log::warning("Database {$dbName} does not exist");
                        continue;
                    }

                    // Create connection for this admin's database
                    $connectionName = DatabaseService::createConnection($dbName);

                    // Reconnect to ensure fresh connection
                    DB::purge($connectionName);

                    // Query alumni from this admin's database
                    $query = DB::connection($connectionName)
                        ->table('alumni')
                        ->select([
                            'id',
                            'user_id',
                            'name',
                            'email',
                            'phone',
                            'major',
                            'graduation_year',
                            'status',
                            'bio',
                            'skills',
                            'work_status',
                            'avatar',
                            'birth_date',
                            'nisn',
                            'join_date',
                        ])
                        ->whereIn('status', ['active', 'pending', 'siap_bekerja', 'mencari_peluang', 'melanjutkan_pendidikan', 'belum_siap']); // Show all statuses for now

                    if ($search) {
                        $query->where(function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('skills', 'like', "%{$search}%")
                                ->orWhere('major', 'like', "%{$search}%");
                        });
                    }

                    $alumni = $query->get();

                    foreach ($alumni as $alumnus) {
                        // Add admin source information
                        $alumniData = (array) $alumnus;
                        $alumniData['admin_name'] = $admin->name;
                        $alumniData['admin_email'] = $admin->email;
                        $alumniData['source_database'] = $dbName;

                        // Parse skills if it's JSON string
                        if (isset($alumniData['skills']) && is_string($alumniData['skills'])) {
                            $alumniData['skills'] = json_decode($alumniData['skills'], true) ?? [];
                        }

                        // Generate avatar URL
                        if (empty($alumniData['avatar'])) {
                            $alumniData['avatar'] = "https://avatar.vercel.sh/" . strtolower(str_replace(" ", "", $alumniData['name']));
                        } else if (!filter_var($alumniData['avatar'], FILTER_VALIDATE_URL)) {
                            $alumniData['avatar'] = url($alumniData['avatar']);
                        }

                        $allAlumni[] = $alumniData;
                    }
                } catch (\Exception $e) {
                    \Log::error("Error loading alumni from database {$dbName}: " . $e->getMessage());
                    continue;
                }
            }

            // Calculate Stats (Status & Skills)
            // Calculate Stats (Status & Skills)
            $stats = [
                'status_counts' => [
                    'siap_bekerja' => 0,
                    'mencari_peluang' => 0,
                    'melanjutkan_pendidikan' => 0,
                    'belum_siap' => 0,
                ],
                'skill_counts' => [],
                'institution_counts' => [],
                'total_unique_skills' => 0,
                'total_institutions' => 0
            ];

            $uniqueSkills = [];

            foreach ($allAlumni as $alum) {
                // Status
                $workStatus = $alum['work_status'] ?? 'siap_bekerja';
                if ($workStatus === 'active')
                    $workStatus = 'siap_bekerja';

                if (array_key_exists($workStatus, $stats['status_counts'])) {
                    $stats['status_counts'][$workStatus]++;
                }

                // Skills
                $skills = $alum['skills'] ?? [];
                if (is_array($skills)) {
                    foreach ($skills as $skill) {
                        if (is_string($skill)) {
                            $skillName = trim($skill);
                            if ($skillName) {
                                if (!isset($stats['skill_counts'][$skillName])) {
                                    $stats['skill_counts'][$skillName] = 0;
                                }
                                $stats['skill_counts'][$skillName]++;
                                $uniqueSkills[$skillName] = true;
                            }
                        }
                    }
                }

                // Institution (Admin Name)
                $adminName = $alum['admin_name'] ?? 'Unknown';
                if (!isset($stats['institution_counts'][$adminName])) {
                    $stats['institution_counts'][$adminName] = 0;
                }
                $stats['institution_counts'][$adminName]++;
            }

            // Stats finalization
            $stats['total_unique_skills'] = count($uniqueSkills);
            $stats['total_institutions'] = count($stats['institution_counts']);

            // Sort skills by count desc and take top 10
            arsort($stats['skill_counts']);
            $stats['skill_counts'] = array_slice($stats['skill_counts'], 0, 10);

            // Sort institutions by count desc
            arsort($stats['institution_counts']);

            // MANUAL PAGINATION
            $page = $request->input('page', 1);
            $perPage = $request->input('per_page', 9); // Default 9 for grid 3x3
            $total = count($allAlumni);
            $lastPage = ceil($total / $perPage);

            // Slice the array
            $slicedAlumni = array_slice($allAlumni, ($page - 1) * $perPage, $perPage);

            return response()->json([
                'success' => true,
                'data' => $slicedAlumni,
                'stats' => $stats,
                'meta' => [
                    'current_page' => (int) $page,
                    'last_page' => $lastPage,
                    'per_page' => (int) $perPage,
                    'total' => $total,
                    'from' => ($page - 1) * $perPage + 1,
                    'to' => min($page * $perPage, $total)
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error("Error in getAllAlumni: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load alumni data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
