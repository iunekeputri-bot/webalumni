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

            // First, get alumni from master database (for old admin accounts without database_name)
            try {
                $masterAlumni = DB::connection('mysql')->table('alumni')
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
                    ->get();

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
                    $alumni = DB::connection($connectionName)
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
                        ->where('status', 'active') // Only show active alumni
                        ->get();

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

                    \Log::info("Loaded " . count($alumni) . " alumni from {$dbName}");
                } catch (\Exception $e) {
                    \Log::error("Error loading alumni from {$admin->database_name}: " . $e->getMessage());
                    continue;
                }
            }

            \Log::info("Total alumni loaded: " . count($allAlumni));

            return response()->json([
                'success' => true,
                'total' => count($allAlumni),
                'data' => $allAlumni,
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


