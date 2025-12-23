<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Broadcasting authentication for WebSocket (Sanctum-based)
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Auth routes (no middleware required for login)
Route::post('/login', 'AuthController@login')->name('login');

// Register route (only for admin)
Route::middleware('auth:sanctum')->post('/register', 'AuthController@register');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/alumni/me', 'AlumniController@me');
    Route::put('/alumni/me', 'AlumniController@updateMe');
    Route::post('/alumni/avatar', 'AlumniController@uploadAvatar');

    // Company routes
    Route::get('/company/me', 'CompanyController@me');
    Route::put('/company/me', 'CompanyController@updateMe');
    Route::get('/company/jobs', 'CompanyController@getJobPostings');
    Route::get('/company/stats', 'CompanyController@getStats');
    Route::get('/company/alumni', 'CompanyController@getAllAlumni');

    // Document routes
    Route::get('/documents', 'DocumentController@index');
    Route::post('/documents', 'DocumentController@store');
    Route::get('/documents/{id}', 'DocumentController@show');
    Route::get('/documents/{id}/download', 'DocumentController@download');
    Route::delete('/documents/{id}', 'DocumentController@destroy');

    // Alumni CV download (for companies)
    Route::get('/alumni/{userId}/cv', 'AlumniController@downloadCV');

    // Job Application routes
    Route::get('/applications', 'JobApplicationController@getMyApplications');
    Route::post('/applications/submit', 'JobApplicationController@submitApplication');
    Route::get('/applications/{id}', 'JobApplicationController@getApplicationDetails');
    Route::put('/applications/{id}/status', 'JobApplicationController@updateApplicationStatus');
    Route::delete('/applications/{id}', 'JobApplicationController@cancelApplication');
    Route::get('/company/applications', 'JobApplicationController@getApplicationsForCompany');
    // Message routes
    Route::get('/conversations', 'MessageController@getConversations');
    Route::get('/messages/{userId}/{otherUserId}', 'MessageController@getMessages');
    Route::post('/messages', 'MessageController@sendMessage');
    Route::post('/messages/mark-read', 'MessageController@markAsRead');
    Route::delete('/messages/{userId}/{otherUserId}', 'MessageController@deleteConversation');

    // Job postings for authenticated users (with database isolation for admins)
    Route::middleware('set.admin.database')->group(function () {
        // Alumni routes with database isolation
        Route::get('/alumni', 'AlumniController@index');
        Route::post('/alumni', 'AlumniController@store');
        Route::get('/alumni/{id}', 'AlumniController@show');
        Route::put('/alumni/{id}', 'AlumniController@update');
        Route::delete('/alumni/{id}', 'AlumniController@destroy');

        // Alumni import/export routes with database isolation
        Route::get('/alumni/template', 'AlumniController@downloadTemplate');
        Route::get('/alumni/export', 'AlumniController@export');
        Route::post('/alumni/import', 'AlumniController@import');

        Route::post('/job-postings', 'JobPostingController@store');
        Route::put('/job-postings/{id}', 'JobPostingController@update');
        Route::delete('/job-postings/{id}', 'JobPostingController@destroy');
        Route::get('/job-postings/{id}/applications', 'JobPostingController@getApplications');
        Route::get('/job-postings/{id}/views', 'JobPostingController@getJobViews');
        Route::get('/company/jobs', 'JobPostingController@getCompanyJobs');

        // Admin-specific routes with database isolation
        Route::get('/admin/alumni', 'AlumniController@index');
        Route::get('/admin/users', 'CompanyController@index');
    });

    // Job postings for admin (from master database, no isolation)
    Route::get('/admin/job-postings', 'JobPostingController@index');
});

// Super Admin routes (protected - only for super admin, dapat diakses via secret key)
// Custom middleware yang handle auth sendiri (tidak pakai auth:sanctum)
Route::middleware(['allow.super.admin.key'])->group(function () {
    Route::get('/super-admin/users', 'SuperAdminController@getUsers');
    Route::post('/super-admin/users', 'SuperAdminController@createUser');
    Route::delete('/super-admin/users/{userId}', 'SuperAdminController@deleteUser');
    Route::get('/super-admin/stats', 'SuperAdminController@getStats');
    Route::get('/super-admin/databases', 'SuperAdminController@getAdminDatabases');
    Route::post('/super-admin/clear-all', 'SuperAdminController@clearAllData');
    Route::get('/super-admin/alumni', 'SuperAdminController@getAllAlumni');
    Route::get('/super-admin/messages', 'SuperAdminController@getAllMessages');
    Route::get('/super-admin/job-postings', 'SuperAdminController@getAllJobPostings');
    Route::get('/super-admin/applications', 'SuperAdminController@getAllApplications');
    Route::get('/super-admin/maintenance-status', 'SuperAdminController@getMaintenanceStatus');
    Route::post('/super-admin/toggle-maintenance', 'SuperAdminController@toggleMaintenanceMode');
});

// Public maintenance status check (no auth required)
Route::get('/maintenance-status', 'SuperAdminController@getMaintenanceStatus');
// Public stats for landing page
Route::get('/public/stats', 'PublicController@getStats');

// Contact form (public route)
Route::post('/contact', 'ContactController@send');

// Public job postings (for alumni to view and apply)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/job-postings', 'JobPostingController@getPublicJobPostings');
    Route::get('/job-postings/{id}', 'JobPostingController@show');
});
