<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use App\Services\DatabaseService;

class PublicController extends Controller
{
    /**
     * Public stats for landing page (limited, non-sensitive)
     */
    public function getStats(Request $request)
    {
        try {
            // Cache these aggregated numbers for short period to reduce DB load
            $stats = Cache::remember('public_stats', 120, function () {
                // Aggregate across master (primary) and all admin databases
                $originalConnection = config('database.default');

                // Use master connection (assumed configured as 'mysql') for admin list
                $masterConn = 'mysql';

                // Master counts
                $totalAlumni = 0;
                $employedCount = 0;
                $totalCompanies = 0;
                $totalJobPostings = 0;

                try {
                    $totalAlumni += DB::connection($masterConn)->table('alumni')->count();
                    $employedCount += DB::connection($masterConn)->table('alumni')->where('work_status', 'siap_bekerja')->count();
                } catch (\Exception $e) {
                    \Log::error('PublicController:getStats master alumni count failed: ' . $e->getMessage());
                }

                try {
                    $totalCompanies += DB::connection($masterConn)->table('users')->where('role', 'company')->count();
                } catch (\Exception $e) {
                    \Log::error('PublicController:getStats master company count failed: ' . $e->getMessage());
                }

                try {
                    $totalJobPostings += DB::connection($masterConn)->table('job_postings')->count();
                } catch (\Exception $e) {
                    \Log::error('PublicController:getStats master job_postings count failed: ' . $e->getMessage());
                }

                // Get all admin database names from master users table
                try {
                    $adminDbs = DB::connection($masterConn)
                        ->table('users')
                        ->whereNotNull('database_name')
                        ->pluck('database_name')
                        ->unique()
                        ->filter()
                        ->values();
                } catch (\Exception $e) {
                    \Log::error('PublicController:getStats failed to fetch admin list: ' . $e->getMessage());
                    $adminDbs = collect();
                }

                // Iterate each admin DB and sum alumni/employed counts
                foreach ($adminDbs as $dbName) {
                    try {
                        // Create dynamic connection for this admin DB
                        $connName = DatabaseService::createConnection($dbName);

                        // Purge and reconnect to ensure fresh connection
                        DB::purge($connName);
                        DB::reconnect($connName);

                        // Count alumni and employed in this admin DB
                        $count = DB::connection($connName)->table('alumni')->count();
                        $employed = DB::connection($connName)->table('alumni')->where('work_status', 'siap_bekerja')->count();

                        $totalAlumni += $count;
                        $employedCount += $employed;

                        // Count companies and job postings in this admin DB (if present)
                        try {
                            $companyCount = DB::connection($connName)->table('users')->where('role', 'company')->count();
                            $totalCompanies += $companyCount;
                        } catch (\Exception $e) {
                            \Log::debug("PublicController:getStats company count missing in {$dbName}: " . $e->getMessage());
                        }

                        try {
                            $jobCount = DB::connection($connName)->table('job_postings')->count();
                            $totalJobPostings += $jobCount;
                        } catch (\Exception $e) {
                            \Log::debug("PublicController:getStats job_postings missing in {$dbName}: " . $e->getMessage());
                        }

                        // Cleanup this connection
                        DB::purge($connName);
                    } catch (\Exception $e) {
                        \Log::error("PublicController:getStats failed for admin DB {$dbName}: " . $e->getMessage());
                        // continue with other DBs
                    }
                }

                // Companies and job postings are stored on master connection
                try {
                    $totalCompanies = DB::connection($masterConn)->table('users')->where('role', 'company')->count();
                } catch (\Exception $e) {
                    \Log::error('PublicController:getStats company count failed: ' . $e->getMessage());
                    $totalCompanies = 0;
                }

                try {
                    $totalJobPostings = DB::connection($masterConn)->table('job_postings')->count();
                } catch (\Exception $e) {
                    \Log::error('PublicController:getStats job_postings count failed: ' . $e->getMessage());
                    $totalJobPostings = 0;
                }

                $employmentRate = $totalAlumni > 0 ? round(($employedCount / $totalAlumni) * 100) : 0;

                // Restore original default connection
                config(['database.default' => $originalConnection]);
                DB::reconnect();

                return [
                    'total_alumni' => $totalAlumni,
                    'total_companies' => $totalCompanies,
                    'total_job_postings' => $totalJobPostings,
                    'employment_rate' => $employmentRate,
                ];
            });

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching public stats: ' . $e->getMessage(),
            ], 500);
        }
    }
}

