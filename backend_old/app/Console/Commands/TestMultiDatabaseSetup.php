<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\DatabaseService;
use App\User;
use Illuminate\Support\Facades\Hash;

class TestMultiDatabaseSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:multi-database';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Test multi-database setup by creating test admin accounts';

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
     * @return int
     */
    public function handle()
    {
        $this->info('Starting Multi-Database Setup Test...\n');

        try {
            // Create test admin 1
            $this->info('Creating Test Admin 1...');
            $admin1 = User::create([
                'name' => 'Admin One',
                'email' => 'admin1@test.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]);

            $dbName1 = DatabaseService::generateDatabaseName($admin1->id, $admin1->email);
            DatabaseService::createAdminDatabase($dbName1);
            $admin1->update([
                'database_name' => $dbName1,
                'database_created_at' => now(),
            ]);
            $this->info("✓ Created Admin 1 with database: {$dbName1}");

            // Create test admin 2
            $this->info('Creating Test Admin 2...');
            $admin2 = User::create([
                'name' => 'Admin Two',
                'email' => 'admin2@test.com',
                'password' => Hash::make('password456'),
                'role' => 'admin',
            ]);

            $dbName2 = DatabaseService::generateDatabaseName($admin2->id, $admin2->email);
            DatabaseService::createAdminDatabase($dbName2);
            $admin2->update([
                'database_name' => $dbName2,
                'database_created_at' => now(),
            ]);
            $this->info("✓ Created Admin 2 with database: {$dbName2}");

            // Verify databases exist
            $this->info('\nVerifying databases...');
            $exists1 = DatabaseService::databaseExists($dbName1);
            $exists2 = DatabaseService::databaseExists($dbName2);

            if ($exists1 && $exists2) {
                $this->info("✓ Both databases exist and are accessible");
            } else {
                $this->error("✗ Some databases do not exist");
                return 1;
            }

            // Get database sizes
            $this->info('\nDatabase information:');
            $size1 = DatabaseService::getDatabaseSize($dbName1);
            $size2 = DatabaseService::getDatabaseSize($dbName2);

            $this->line("Admin 1 database ({$dbName1}): {$size1} MB");
            $this->line("Admin 2 database ({$dbName2}): {$size2} MB");

            // Display summary
            $this->info('\n✓ Multi-Database Setup Test Completed Successfully!');
            $this->line("\nTest Summary:");
            $this->line("- Created 2 test admin accounts");
            $this->line("- Created 2 isolated databases");
            $this->line("- Ran migrations on both databases");
            $this->line("\nAdmin 1 Credentials:");
            $this->line("  Email: admin1@test.com");
            $this->line("  Password: password123");
            $this->line("  Database: {$dbName1}");
            $this->line("\nAdmin 2 Credentials:");
            $this->line("  Email: admin2@test.com");
            $this->line("  Password: password456");
            $this->line("  Database: {$dbName2}");

            return 0;
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
    }
}
