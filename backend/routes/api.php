<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Broadcasting authentication
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Auth routes
Route::post('/login', [AuthController::class, 'login']);

// Register route
Route::middleware('auth:sanctum')->post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/alumni/me', [AlumniController::class, 'me']);
    Route::put('/alumni/me', [AlumniController::class, 'updateMe']);
    Route::post('/alumni/avatar', [AlumniController::class, 'uploadAvatar']);

    // Company routes
    Route::get('/company/me', [CompanyController::class, 'me']);
    Route::put('/company/me', [CompanyController::class, 'updateMe']);
    Route::get('/company/jobs', [CompanyController::class, 'getJobPostings']);
    Route::get('/company/stats', [CompanyController::class, 'getStats']);
    Route::get('/company/alumni', [CompanyController::class, 'getAllAlumni']);
    Route::post('/alumni/{id}/view', [AlumniController::class, 'recordProfileView']); // New route
    Route::get('/alumni/profile-views', [AlumniController::class, 'getProfileViewsStats']); // New route

    // Document routes
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);

    // Alumni CV download
    Route::get('/alumni/{userId}/cv', [AlumniController::class, 'downloadCV']);

    // Job Application routes
    Route::get('/applications', [JobApplicationController::class, 'getMyApplications']);
    Route::post('/applications/submit', [JobApplicationController::class, 'submitApplication']);
    Route::get('/applications/{id}', [JobApplicationController::class, 'getApplicationDetails']);
    Route::put('/applications/{id}/status', [JobApplicationController::class, 'updateApplicationStatus']);
    Route::delete('/applications/{id}', [JobApplicationController::class, 'cancelApplication']);
    Route::get('/company/applications', [JobApplicationController::class, 'getApplicationsForCompany']);

    // Message routes
    Route::get('/conversations', [MessageController::class, 'getConversations']);
    Route::get('/messages/{userId}/{otherUserId}', [MessageController::class, 'getMessages']);
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    Route::post('/messages/mark-read', [MessageController::class, 'markAsRead']);
    Route::delete('/messages/{userId}/{otherUserId}', [MessageController::class, 'deleteConversation']);

    // Job postings for authenticated users (with database isolation for admins)
    Route::middleware('set.admin.database')->group(function () {
        // Alumni import/export
        Route::get('/alumni/template', [AlumniController::class, 'downloadTemplate']);
        Route::get('/alumni/export', [AlumniController::class, 'export']);
        Route::post('/alumni/import', [AlumniController::class, 'import']);

        // Alumni routes with database isolation
        Route::get('/alumni', [AlumniController::class, 'index']);
        Route::post('/alumni', [AlumniController::class, 'store']);
        Route::get('/alumni/{id}', [AlumniController::class, 'show']);
        Route::put('/alumni/{id}', [AlumniController::class, 'update']);
        Route::delete('/alumni/{id}', [AlumniController::class, 'destroy']);

        Route::post('/job-postings', [JobPostingController::class, 'store']);
        Route::put('/job-postings/{id}', [JobPostingController::class, 'update']);
        Route::delete('/job-postings/{id}', [JobPostingController::class, 'destroy']);
        Route::get('/job-postings/{id}/applications', [JobPostingController::class, 'getApplications']);
        Route::get('/job-postings/{id}/views', [JobPostingController::class, 'getJobViews']);
        Route::get('/company/jobs', [JobPostingController::class, 'getCompanyJobs']);

        // Admin-specific
        Route::get('/admin/alumni', [AlumniController::class, 'index']);
        Route::get('/admin/users', [CompanyController::class, 'index']);
    });

    // Job postings for admin
    Route::get('/admin/job-postings', [JobPostingController::class, 'index']);
});

// Super Admin routes
Route::middleware(['allow.super.admin.key'])->group(function () {
    Route::get('/super-admin/users', [SuperAdminController::class, 'getUsers']);
    Route::post('/super-admin/users', [SuperAdminController::class, 'createUser']);
    Route::delete('/super-admin/users/{userId}', [SuperAdminController::class, 'deleteUser']);
    Route::get('/super-admin/stats', [SuperAdminController::class, 'getStats']);
    Route::get('/super-admin/databases', [SuperAdminController::class, 'getAdminDatabases']);
    Route::post('/super-admin/clear-all', [SuperAdminController::class, 'clearAllData']);
    Route::get('/super-admin/alumni', [SuperAdminController::class, 'getAllAlumni']);
    Route::get('/super-admin/messages', [SuperAdminController::class, 'getAllMessages']);
    Route::get('/super-admin/job-postings', [SuperAdminController::class, 'getAllJobPostings']);
    Route::get('/super-admin/applications', [SuperAdminController::class, 'getAllApplications']);
    Route::get('/super-admin/maintenance-status', [SuperAdminController::class, 'getMaintenanceStatus']);
    Route::post('/super-admin/toggle-maintenance', [SuperAdminController::class, 'toggleMaintenanceMode']);
    Route::get('/super-admin/system-resources', [SuperAdminController::class, 'getSystemResources']);
});

Route::get('/maintenance-status', [SuperAdminController::class, 'getMaintenanceStatus']);
Route::get('/public/stats', [PublicController::class, 'getStats']);
Route::post('/contact', [ContactController::class, 'send']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/job-postings', [JobPostingController::class, 'getPublicJobPostings']);
    Route::get('/job-postings/{id}', [JobPostingController::class, 'show']);
});
