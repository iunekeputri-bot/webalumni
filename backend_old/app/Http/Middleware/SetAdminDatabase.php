<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SetAdminDatabase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        if ($user && $user->role === 'admin' && $user->database_name) {
            // Get the admin's database name
            $dbName = $user->database_name;

            // Get base mysql config
            $dbConfig = Config::get('database.connections.mysql');

            // Create config for admin's database
            $adminDbConfig = $dbConfig;
            $adminDbConfig['database'] = $dbName;

            // Set admin database config
            Config::set('database.connections.' . $dbName, $adminDbConfig);

            // Change default connection to admin's database
            Config::set('database.default', $dbName);

            // Purge any cached connections
            DB::purge($dbName);

            // Force reconnect to new database
            DB::reconnect($dbName);

            \Log::info("Admin {$user->email} switched to database: {$dbName}");
        }

        return $next($request);
    }
}
