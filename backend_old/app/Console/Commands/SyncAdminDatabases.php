<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use App\Services\DatabaseService;
use Illuminate\Support\Facades\DB;

class SyncAdminDatabases extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:sync-databases';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all admin databases (create if missing, migrate)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('Starting admin database synchronization...');

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            $this->info("Checking admin: {$admin->name} ({$admin->email})");

            if (!$admin->database_name) {
                $this->warn("Admin {$admin->name} has no database assigned. Generating one...");
                $databaseName = DatabaseService::generateDatabaseName($admin->id, $admin->email);
                $admin->update(['database_name' => $databaseName]);
                $this->info("Assigned database name: {$databaseName}");
            }

            $databaseName = $admin->database_name;

            try {
                // Check if database exists
                $exists = DB::select("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [$databaseName]);

                if (empty($exists)) {
                    $this->info("Database {$databaseName} does not exist. Creating...");
                    DatabaseService::createAdminDatabase($databaseName);
                    $this->info("Database created and migrated successfully.");
                } else {
                    $this->info("Database {$databaseName} exists. Running migrations...");
                    DatabaseService::migrateDatabase($databaseName);
                    $this->info("Migrations completed.");
                }

            } catch (\Exception $e) {
                $this->error("Error processing admin {$admin->name}: " . $e->getMessage());
            }
        }

        $this->info('Admin database synchronization completed!');
    }
}
