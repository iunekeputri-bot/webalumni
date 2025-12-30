<?php

namespace App\Http\Controllers;

use App\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    /**
     * Get all active job postings
     */
    public function index(Request $request)
    {
        $query = JobPosting::with('company')
            ->where('status', 'open')
            ->orderBy('created_at', 'desc');

        // Filter by search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by location
        if ($request->has('location')) {
            $query->where('location', $request->input('location'));
        }

        // Filter by job type
        if ($request->has('job_type')) {
            $query->where('job_type', $request->input('job_type'));
        }

        $jobPostings = $query->paginate(10);

        return response()->json($jobPostings);
    }

    /**
     * Get job posting details
     */
    public function show(Request $request, $id)
    {
        try {
            \Log::info("[JobPosting] Fetching job posting with ID: {$id}");
            \Log::info("[JobPosting] Current DB connection: " . config('database.default'));

            $user = $request->user();

            // Force use master database connection
            $jobPosting = \DB::connection('mysql')
                ->table('job_postings')
                ->where('id', $id)
                ->first();

            if (!$jobPosting) {
                \Log::warning("[JobPosting] Job posting not found with ID: {$id}");
                return response()->json([
                    'message' => 'Job posting not found'
                ], 404);
            }

            \Log::info("[JobPosting] Job posting found: {$jobPosting->title}");

            // Log user info for debugging
            if ($user) {
                \Log::info("[JobPosting] User authenticated - ID: {$user->id}, Role: {$user->role}, Name: {$user->name}");
            } else {
                \Log::warning("[JobPosting] No authenticated user found");
            }

            // Get company info
            $company = \DB::connection('mysql')->table('users')
                ->where('id', $jobPosting->company_id)
                ->first();

            if ($company) {
                $jobPosting->company = (object) [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                ];
            }

            // Parse requirements JSON
            if (isset($jobPosting->requirements) && is_string($jobPosting->requirements)) {
                $jobPosting->requirements = json_decode($jobPosting->requirements);
            }

            // Record job view if user is alumni
            if ($user && $user->role === 'alumni') {
                try {
                    \Log::info("[JobPosting] Recording view for alumni user: {$user->id}, Job ID: {$id}");

                    // Check if record already exists
                    $existingView = \DB::connection('mysql')->table('job_views')
                        ->where('job_posting_id', $id)
                        ->where('user_id', $user->id)
                        ->first();

                    if ($existingView) {
                        \Log::info("[JobPosting] Updating existing view record ID: {$existingView->id}");
                        \DB::connection('mysql')->table('job_views')
                            ->where('id', $existingView->id)
                            ->update([
                                'viewed_at' => now(),
                                'updated_at' => now()
                            ]);
                    } else {
                        \Log::info("[JobPosting] Creating new view record");
                        \DB::connection('mysql')->table('job_views')->insert([
                            'job_posting_id' => $id,
                            'user_id' => $user->id,
                            'viewed_at' => now(),
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                    }

                    // Verify insertion
                    $viewCount = \DB::connection('mysql')->table('job_views')
                        ->where('job_posting_id', $id)
                        ->where('user_id', $user->id)
                        ->count();
                    \Log::info("[JobPosting] View record count for this user/job: {$viewCount}");

                } catch (\Exception $e) {
                    \Log::error("[JobPosting] Failed to record view: " . $e->getMessage());
                    \Log::error("[JobPosting] Stack trace: " . $e->getTraceAsString());
                }
            } else {
                \Log::warning("[JobPosting] View not recorded - User is not alumni or not authenticated");
            }

            // Increment total views counter
            try {
                \DB::connection('mysql')->table('job_postings')
                    ->where('id', $id)
                    ->increment('views');
            } catch (\Exception $e) {
                \Log::warning("[JobPosting] Failed to increment views: " . $e->getMessage());
            }

            \Log::info("[JobPosting] Returning job posting data");
            return response()->json($jobPosting, 200);
        } catch (\Exception $e) {
            \Log::error('[JobPosting] Error: ' . $e->getMessage());
            \Log::error('[JobPosting] Trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Create a new job posting
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'company') {
            return response()->json(['message' => 'Only companies can post jobs'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'job_type' => 'required|string',
            'requirements' => 'nullable|array',
        ]);

        // Map job_type from frontend format to backend format
        $jobTypeMap = [
            'full-time' => 'full-time',
            'part-time' => 'part-time',
            'contract' => 'contract',
            'internship' => 'internship',
            'Full Time' => 'full-time',
            'Part Time' => 'part-time',
            'Contract' => 'contract',
        ];

        $jobType = $jobTypeMap[$request->job_type] ?? $request->job_type;

        $jobPosting = JobPosting::create([
            'company_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'position' => $request->title, // Use title as position since frontend doesn't send it
            'location' => $request->location,
            'salary_range' => $request->salary, // Map salary to salary_range
            'job_type' => $jobType,
            'requirements' => $request->requirements,
            'status' => $request->status ?? 'open',
        ]);

        return response()->json($jobPosting, 201);
    }

    /**
     * Get jobs for authenticated company
     */
    public function getCompanyJobs(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'company') {
            return response()->json(['message' => 'Only companies can access this'], 403);
        }

        // Force use master database to get accurate views count
        $jobs = \DB::connection('mysql')
            ->table('job_postings')
            ->where('company_id', $user->id)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Parse requirements JSON for each job
        $jobs = $jobs->map(function ($job) {
            if (isset($job->requirements) && is_string($job->requirements)) {
                $job->requirements = json_decode($job->requirements);
            }
            // Add applicants count
            $job->applicants = \DB::connection('mysql')
                ->table('job_applications')
                ->where('job_posting_id', $job->id)
                ->count();

            return $job;
        });

        return response()->json($jobs);
    }
    /**
     * Update a job posting
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $jobPosting = JobPosting::findOrFail($id);

        if ($jobPosting->company_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'job_type' => 'required|string',
            'requirements' => 'nullable|array',
            'status' => 'nullable|in:open,closed',
        ]);

        // Map job_type from frontend format to backend format
        $jobTypeMap = [
            'full-time' => 'full-time',
            'part-time' => 'part-time',
            'contract' => 'contract',
            'internship' => 'internship',
        ];

        $jobType = $jobTypeMap[$request->job_type] ?? $request->job_type;

        $jobPosting->update([
            'title' => $request->title,
            'description' => $request->description,
            'position' => $request->title,
            'location' => $request->location,
            'salary_range' => $request->salary,
            'job_type' => $jobType,
            'requirements' => $request->requirements,
            'status' => $request->status ?? $jobPosting->status,
        ]);

        return response()->json($jobPosting);
    }

    /**
     * Get applications for a specific job
     */
    public function getApplications(Request $request, $id)
    {
        $user = $request->user();
        $jobPosting = JobPosting::findOrFail($id);

        if ($jobPosting->company_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $applications = \App\JobApplication::with(['user', 'alumni'])
            ->where('job_posting_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    /**
     * Delete a job posting
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $jobPosting = JobPosting::findOrFail($id);

        if ($jobPosting->company_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            \DB::beginTransaction();

            // Delete related job views
            \DB::connection('mysql')->table('job_views')
                ->where('job_posting_id', $id)
                ->delete();

            // Delete related job applications and their documents
            $applications = \DB::connection('mysql')->table('job_applications')
                ->where('job_posting_id', $id)
                ->get();

            foreach ($applications as $application) {
                // Delete application documents
                \DB::connection('mysql')->table('application_documents')
                    ->where('application_id', $application->id)
                    ->delete();
            }

            // Delete job applications
            \DB::connection('mysql')->table('job_applications')
                ->where('job_posting_id', $id)
                ->delete();

            // Finally delete the job posting
            $jobPosting->delete();

            \DB::commit();

            \Log::info("[JobPosting] Job ID {$id} and all related data deleted successfully");

            return response()->json(['message' => 'Job posting and all related data deleted successfully']);
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error("[JobPosting] Failed to delete job: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete job posting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all public job postings (for alumni to view)
     * This reads from master database where companies post jobs
     */
    public function getPublicJobPostings(Request $request)
    {
        try {
            // Use master database connection
            \DB::connection('mysql');

            $query = JobPosting::on('mysql')
                ->where('status', 'open')
                ->orderBy('created_at', 'desc');

            // Filter by search
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
                });
            }

            // Filter by location
            if ($request->has('location') && $request->input('location')) {
                $query->where('location', 'like', '%' . $request->input('location') . '%');
            }

            // Filter by job type
            if ($request->has('job_type') && $request->input('job_type')) {
                $query->where('job_type', $request->input('job_type'));
            }

            $jobPostings = $query->paginate(20);

            // Get company names
            $jobPostings->getCollection()->transform(function ($job) {
                $company = \DB::connection('mysql')->table('users')
                    ->where('id', $job->company_id)
                    ->where('role', 'company')
                    ->first();

                $job->company_name = $company ? $company->name : 'Unknown';
                return $job;
            });

            return response()->json([
                'success' => true,
                'data' => $jobPostings->items(),
                'total' => $jobPostings->total(),
                'current_page' => $jobPostings->currentPage(),
                'per_page' => $jobPostings->perPage(),
                'last_page' => $jobPostings->lastPage(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching public job postings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load job postings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get list of alumni who viewed this job posting
     */
    public function getJobViews(Request $request, $id)
    {
        try {
            $user = $request->user();

            // Check if job posting exists and belongs to this company
            $jobPosting = \DB::connection('mysql')
                ->table('job_postings')
                ->where('id', $id)
                ->first();

            if (!$jobPosting) {
                return response()->json(['message' => 'Job posting not found'], 404);
            }

            // Only company owner or admin can view this
            if ($user->role === 'company' && $jobPosting->company_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Get all alumni who viewed this job
            $views = \DB::connection('mysql')
                ->table('job_views')
                ->join('users', 'job_views.user_id', '=', 'users.id')
                ->where('job_views.job_posting_id', $id)
                ->select('job_views.*', 'users.name', 'users.email')
                ->orderBy('job_views.viewed_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'job_id' => $id,
                'job_title' => $jobPosting->title,
                'total_views' => $views->count(),
                'views' => $views
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching job views: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load job views: ' . $e->getMessage()
            ], 500);
        }
    }
}


