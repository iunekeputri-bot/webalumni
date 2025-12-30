<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class MigrateTenants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-tenants {--class= : The specific migration class/path to run}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run migrations for all tenant databases';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $admins = User::whereNotNull('database_name')->where('role', 'admin')->get();
        $migrationFile = 'database/migrations/2025_12_30_130551_remove_user_id_fk_from_alumni_and_documents_tables.php'; // Hardcoded for this fix

        $this->info("Found " . $admins->count() . " tenant databases.");

        foreach ($admins as $admin) {
            $dbName = $admin->database_name;
            $this->info("Migrating tenant: {$dbName} (Admin: {$admin->email})");

            try {
                // Dynamically configure the connection
                Config::set("database.connections.{$dbName}", [
                    'driver' => 'mysql',
                    'host' => env('DB_HOST', '127.0.0.1'),
                    'port' => env('DB_PORT', '3306'),
                    'database' => $dbName,
                    'username' => env('DB_USERNAME', 'root'),
                    'password' => env('DB_PASSWORD', ''),
                    'unix_socket' => env('DB_SOCKET', ''),
                    'charset' => 'utf8mb4',
                    'collation' => 'utf8mb4_unicode_ci',
                    'prefix' => '',
                    'strict' => true,
                    'engine' => null,
                ]);

                // Run migration
                Artisan::call('migrate', [
                    '--database' => $dbName,
                    '--path' => $migrationFile,
                    '--force' => true,
                ], $this->output);

                $this->info("Done migrating {$dbName}");

            } catch (\Exception $e) {
                $this->error("Failed to migrate {$dbName}: " . $e->getMessage());
            }
        }
    }
}
