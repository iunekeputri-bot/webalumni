<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\DatabaseService;
use App\User;

class CleanupAdminDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:cleanup-database {adminId}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Delete a specific admin database (use with caution)';

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
        $adminId = $this->argument('adminId');
        $user = User::find($adminId);

        if (!$user) {
            $this->error("Admin with ID {$adminId} not found");
            return 1;
        }

        if ($user->role !== 'admin') {
            $this->error("User with ID {$adminId} is not an admin");
            return 1;
        }

        if (!$user->database_name) {
            $this->error("Admin {$user->name} has no database assigned");
            return 1;
        }

        $this->warn("⚠️  WARNING: This will delete the database: {$user->database_name}");
        $this->warn("All data for admin {$user->name} ({$user->email}) will be permanently lost!");

        if (!$this->confirm('Are you absolutely sure?', false)) {
            $this->info('Cleanup cancelled');
            return 0;
        }

        try {
            $this->info("Deleting database: {$user->database_name}...");
            DatabaseService::deleteAdminDatabase($user->database_name);
            $this->info("✓ Database deleted successfully");

            return 0;
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
    }
}
