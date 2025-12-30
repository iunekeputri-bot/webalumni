<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SetAlumniDatabase
{
    /**
     * Handle an incoming request for alumni users.
     * Alumni need to access their admin's database where job postings are stored.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        if ($user && $user->role === 'alumni') {
            // Alumni users need to know which admin database they belong to
            // Since alumni don't have database_name field, we need to find their admin

            // Try to get admin database from the alumni's token or session
            // For now, we'll search all admin databases to find where this alumni exists

            try {
                // Get all admin users with databases
                $admins = DB::connection('mysql')
                    ->table('users')
                    ->where('role', 'admin')
                    ->whereNotNull('database_name')
                    ->pluck('database_name', 'id');

                $foundInDatabase = null;

                // Search for this alumni in each admin database
                foreach ($admins as $adminId => $dbName) {
                    try {
                        // Get base mysql config
                        $dbConfig = Config::get('database.connections.mysql');

                        // Create config for admin's database
                        $adminDbConfig = $dbConfig;
                        $adminDbConfig['database'] = $dbName;

                        // Set admin database config
                        Config::set('database.connections.temp_' . $dbName, $adminDbConfig);

                        // Check if alumni exists in this database
                        $alumniExists = DB::connection('temp_' . $dbName)
                            ->table('alumni')
                            ->where('user_id', $user->id)
                            ->exists();

                        if ($alumniExists) {
                            $foundInDatabase = $dbName;
                            \Log::info("Alumni {$user->email} found in database: {$dbName}");
                            break;
                        }

                        // Clean up temp connection
                        DB::purge('temp_' . $dbName);
                    } catch (\Exception $e) {
                        \Log::error("Error checking alumni in database {$dbName}: " . $e->getMessage());
                        continue;
                    }
                }

                if ($foundInDatabase) {
                    // Get base mysql config
                    $dbConfig = Config::get('database.connections.mysql');

                    // Create config for the found database
                    $adminDbConfig = $dbConfig;
                    $adminDbConfig['database'] = $foundInDatabase;

                    // Set admin database config
                    Config::set('database.connections.' . $foundInDatabase, $adminDbConfig);

                    // Change default connection to admin's database
                    Config::set('database.default', $foundInDatabase);

                    // Purge any cached connections
                    DB::purge($foundInDatabase);

                    // Force reconnect to new database
                    DB::reconnect($foundInDatabase);

                    \Log::info("Alumni {$user->email} switched to database: {$foundInDatabase}");
                } else {
                    \Log::warning("Alumni {$user->email} not found in any admin database");
                }
            } catch (\Exception $e) {
                \Log::error("Error in SetAlumniDatabase middleware: " . $e->getMessage());
            }
        }

        return $next($request);
    }
}

