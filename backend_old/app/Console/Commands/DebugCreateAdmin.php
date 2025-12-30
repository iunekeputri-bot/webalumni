<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\DatabaseService;
use App\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DebugCreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:debug {name} {email} {password}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Debug admin creation process step by step';

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

        $this->info('=== ADMIN CREATION DEBUG ===');
        $this->info('');

        try {
            // Step 1: Check email
            $this->info('[1/5] Checking email...');
            if (User::where('email', $email)->exists()) {
                $this->error("❌ Email {$email} already exists!");
                return 1;
            }
            $this->info("✓ Email is unique");
            $this->info('');

            // Step 2: Create user
            $this->info('[2/5] Creating user...');
            DB::beginTransaction();

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);

            $this->info("✓ User created with ID: {$user->id}");
            $this->info('');

            // Step 3: Generate database name
            $this->info('[3/5] Generating database name...');
            $databaseName = DatabaseService::generateDatabaseName($user->id, $user->email);
            $this->info("✓ Database name: {$databaseName}");
            $this->info('');

            // Step 4: Create database
            $this->info('[4/5] Creating database...');
            $this->info("  - Executing: CREATE DATABASE `{$databaseName}`");

            try {
                DatabaseService::createAdminDatabase($databaseName);
                $this->info("✓ Database created successfully");
            } catch (\Exception $dbError) {
                $this->error("❌ Database creation failed!");
                $this->error("   Error: " . $dbError->getMessage());
                DB::rollBack();
                return 1;
            }
            $this->info('');

            // Step 5: Update user record
            $this->info('[5/5] Updating user record...');
            $user->update([
                'database_name' => $databaseName,
                'database_created_at' => now(),
            ]);
            $this->info("✓ User record updated");
            $this->info('');

            DB::commit();

            // Verification
            $this->info('=== VERIFICATION ===');
            $this->info('');

            $dbExists = DatabaseService::databaseExists($databaseName);
            $this->info("Database exists: " . ($dbExists ? '✓ YES' : '❌ NO'));

            if ($dbExists) {
                $dbSize = DatabaseService::getDatabaseSize($databaseName);
                $this->info("Database size: {$dbSize} MB");
            }

            $this->info('');
            $this->table(
                ['Property', 'Value'],
                [
                    ['Admin ID', $user->id],
                    ['Name', $user->name],
                    ['Email', $user->email],
                    ['Password', $password],
                    ['Database', $databaseName],
                    ['Database Exists', $dbExists ? 'YES' : 'NO'],
                ]
            );

            $this->info('');
            $this->info('✅ Admin created successfully!');

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('');
            $this->error('❌ ERROR: ' . $e->getMessage());
            $this->error('');
            $this->error('Stack trace:');
            $this->error($e->getTraceAsString());
            return 1;
        }
    }
}
