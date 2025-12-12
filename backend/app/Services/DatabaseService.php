<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class DatabaseService
{
    /**
     * Generate unique database name for admin
     */
    public static function generateDatabaseName($adminId, $adminEmail)
    {
        // Format: admin_{id}_{timestamp}
        $timestamp = time();
        $emailPrefix = explode('@', $adminEmail)[0];
        $dbName = 'admin_' . $adminId . '_' . preg_replace('/[^a-zA-Z0-9_]/', '', strtolower($emailPrefix));

        return $dbName;
    }

    /**
     * Create database for admin
     */
    public static function createAdminDatabase($databaseName)
    {
        try {
            \Log::info("Creating database: {$databaseName}");

            // Create database
            DB::statement("CREATE DATABASE IF NOT EXISTS `{$databaseName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            \Log::info("Database created successfully: {$databaseName}");

            // Verify database exists
            if (!self::databaseExists($databaseName)) {
                throw new \Exception("Database creation verification failed - database does not exist");
            }

            \Log::info("Database verified to exist: {$databaseName}");

            // Run migrations on new database
            self::migrateDatabase($databaseName);

            \Log::info("Database migration completed: {$databaseName}");

            return true;
        } catch (\Exception $e) {
            \Log::error("Failed to create database {$databaseName}: " . $e->getMessage());
            throw new \Exception("Failed to create database: " . $e->getMessage());
        }
    }

    /**
     * Run migrations on specific database
     */
    public static function migrateDatabase($databaseName)
    {
        try {
            \Log::info("Starting migration for database: {$databaseName}");

            // Store original connection
            $originalConnection = config('database.default');
            $originalDbName = config('database.connections.mysql.database');

            // Create temporary connection config
            $dbConfig = Config::get('database.connections.mysql');
            $dbConfig['database'] = $databaseName;

            // Register temporary connection
            Config::set('database.connections.temp_' . $databaseName, $dbConfig);

            // Create PDO connection to test
            $tempConnection = 'temp_' . $databaseName;
            DB::purge($tempConnection);

            \Log::info("Temporary connection configured: {$tempConnection}");

            // Run migrations with timeout
            set_time_limit(300); // 5 minutes timeout

            \Log::info("Executing migrations for: {$databaseName}");

            $exitCode = \Artisan::call('migrate', [
                '--database' => $tempConnection,
                '--force' => true,
                '--no-interaction' => true,
            ]);

            \Log::info("Migration exit code: {$exitCode}");

            // Get migration output
            $output = \Artisan::output();
            \Log::info("Migration output: " . $output);

            // Reset connection to original
            DB::purge($tempConnection);
            Config::set('database.default', $originalConnection);
            Config::set('database.connections.mysql.database', $originalDbName);

            if ($exitCode !== 0) {
                throw new \Exception("Migration exited with code: " . $exitCode . ". Output: " . $output);
            }

            \Log::info("Migration completed successfully for: {$databaseName}");
            return true;
        } catch (\Exception $e) {
            \Log::error("Migration failed for {$databaseName}: " . $e->getMessage());
            // Reset connection on error
            DB::purge('temp_' . $databaseName);
            Config::set('database.default', config('database.default'));
            throw new \Exception("Migration failed: " . $e->getMessage());
        }
    }

    /**
     * Get admin database connection
     */
    public static function getAdminConnection($userId)
    {
        $user = \App\User::find($userId);

        if (!$user || !$user->database_name) {
            return null;
        }

        return self::createConnection($user->database_name);
    }

    /**
     * Create dynamic connection configuration
     */
    public static function createConnection($databaseName)
    {
        $baseConfig = Config::get('database.connections.mysql');
        $baseConfig['database'] = $databaseName;

        Config::set('database.connections.' . $databaseName, $baseConfig);

        return $databaseName;
    }

    /**
     * Delete admin database and related data
     */
    public static function deleteAdminDatabase($databaseName)
    {
        try {
            DB::statement("DROP DATABASE IF EXISTS `{$databaseName}`");
            return true;
        } catch (\Exception $e) {
            throw new \Exception("Failed to delete database: " . $e->getMessage());
        }
    }

    /**
     * Check if database exists
     */
    public static function databaseExists($databaseName)
    {
        try {
            $result = DB::select("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [$databaseName]);
            return !empty($result);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get admin database size
     */
    public static function getDatabaseSize($databaseName)
    {
        try {
            $result = DB::select("
                SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
                FROM information_schema.TABLES
                WHERE table_schema = ?
            ", [$databaseName]);

            return $result[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }
}
