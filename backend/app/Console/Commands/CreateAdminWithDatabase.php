<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\DatabaseService;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CreateAdminWithDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {name} {email} {password}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Create admin with dedicated database (non-blocking)';

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
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');

        try {
            $this->info('Creating admin account...');

            // Check if email exists
            if (User::where('email', $email)->exists()) {
                $this->error("Email {$email} already exists!");
                return 1;
            }

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);

            $this->info("✓ Admin user created with ID: {$user->id}");

            // Generate database name
            $databaseName = DatabaseService::generateDatabaseName($user->id, $user->email);
            $this->info("✓ Database name generated: {$databaseName}");

            // Create database
            $this->info('Creating database...');
            DatabaseService::createAdminDatabase($databaseName);
            $this->info("✓ Database created successfully");

            // Update user with database info
            $user->update([
                'database_name' => $databaseName,
                'database_created_at' => now(),
            ]);

            DB::commit();

            $this->info('');
            $this->info('✅ Admin created successfully!');
            $this->info('');
            $this->table(
                ['Property', 'Value'],
                [
                    ['Admin ID', $user->id],
                    ['Name', $user->name],
                    ['Email', $user->email],
                    ['Password', $password],
                    ['Database', $databaseName],
                    ['Role', 'admin'],
                ]
            );

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
    }
}
