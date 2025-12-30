<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\Document;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobApplicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all job applications for alumni
     */
    public function getMyApplications(Request $request)
    {
        $applications = JobApplication::with([
            'jobPosting' => function ($query) {
                $query->withTrashed();
            },
            'jobPosting.company'
        ])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    /**
     * Get all applications for a company's job postings
     */
    public function getApplicationsForCompany(Request $request)
    {
        $applications = JobApplication::with(['jobPosting', 'alumni', 'user', 'documents'])
            ->whereHas('jobPosting', function ($query) use ($request) {
                $query->where('company_id', $request->user()->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    /**
     * Submit job application
     */
    public function submitApplication(Request $request)
    {
        $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
            'cover_letter' => 'required|string|max:5000',
            'document_ids' => 'nullable|array',
            'document_ids.*' => 'exists:documents,id',
        ]);

        $user = $request->user();
        $alumni = \App\Models\Alumni::where('user_id', $user->id)->first();

        if (!$alumni) {
            return response()->json(['message' => 'Alumni profile not found'], 404);
        }

        // Check if already applied to this job posting
        $existingApplication = JobApplication::where('job_posting_id', $request->input('job_posting_id'))
            ->where('user_id', $user->id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah pernah melamar ke lowongan pekerjaan ini',
                'existing_application' => [
                    'id' => $existingApplication->id,
                    'status' => $existingApplication->status,
                    'applied_at' => $existingApplication->created_at->format('Y-m-d H:i:s')
                ]
            ], 409);
        }

        try {
            return DB::transaction(function () use ($request, $user, $alumni) {
                // Create application
                $application = JobApplication::create([
                    'job_posting_id' => $request->input('job_posting_id'),
                    'alumni_id' => $alumni->id,
                    'user_id' => $user->id,
                    'cover_letter' => $request->input('cover_letter'),
                    'status' => 'pending',
                ]);

                // Attach documents if provided
                if ($request->has('document_ids') && is_array($request->input('document_ids'))) {
                    $application->documents()->attach($request->input('document_ids'));
                }

                // Send initial message to company (don't auto-send)
                $jobPosting = JobPosting::find($request->input('job_posting_id'));
                $message = Message::create([
                    'sender_id' => $user->id,
                    'receiver_id' => $jobPosting->company_id,
                    'message' => "Saya ingin melamar untuk posisi {$jobPosting->title}.\n\n{$request->input('cover_letter')}",
                    'status' => 'draft', // Mark as draft, not sent yet
                    'job_application_id' => $application->id,
                ]);

                // Broadcast event
                broadcast(new \App\Events\JobApplicationSubmitted($application))->toOthers();

                return response()->json([
                    'application' => $application->load(['jobPosting.company', 'documents']),
                    'message' => $message,
                    'message_text' => $message->message,
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal melamar: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get application details with documents
     */
    public function getApplicationDetails($applicationId, Request $request)
    {
        $application = JobApplication::with([
            'jobPosting' => function ($query) {
                $query->withTrashed();
            },
            'jobPosting.company',
            'alumni',
            'user',
            'documents'
        ])
            ->findOrFail($applicationId);

        // Check authorization
        $user = $request->user();
        if ($application->user_id !== $user->id && $application->jobPosting->company_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($application);
    }

    /**
     * Update application status (for companies)
     */
    public function updateApplicationStatus($applicationId, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,viewed,accepted,rejected',
            'review_notes' => 'nullable|string|max:1000',
        ]);

        $application = JobApplication::findOrFail($applicationId);

        // Check authorization
        if ($application->jobPosting->company_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $application->update([
            'status' => $request->input('status'),
            'review_notes' => $request->input('review_notes'),
            'reviewed_at' => now(),
        ]);

        broadcast(new \App\Events\JobApplicationStatusUpdated($application));

        return response()->json($application);
    }

    /**
     * Cancel application
     */
    public function cancelApplication($applicationId, Request $request)
    {
        $application = JobApplication::findOrFail($applicationId);

        // Check authorization
        if ($application->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Detach documents
        $application->documents()->detach();

        // Delete related messages
        Message::where('job_application_id', $applicationId)->delete();

        $application->delete();

        return response()->json(['message' => 'Aplikasi berhasil dibatalkan'], 200);
    }
}


