<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\User;
use App\JobPosting;
use App\Services\DatabaseService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

function switchDatabase($user) {
    if ($user && $user->role === 'admin' && $user->database_name) {
        $dbName = $user->database_name;
        $dbConfig = Config::get('database.connections.mysql');
        $adminDbConfig = $dbConfig;
        $adminDbConfig['database'] = $dbName;

        Config::set('database.connections.' . $dbName, $adminDbConfig);
        Config::set('database.default', $dbName);

        DB::purge($dbName);
        DB::reconnect($dbName);

        echo "Switched to database: {$dbName}\n";
    }
}

function resetDatabase() {
    $default = 'mysql';
    Config::set('database.default', $default);
    DB::purge($default);
    DB::reconnect($default);
    echo "Reset to default database\n";
}

echo "--- STARTING ISOLATION TEST ---\n\n";

// 1. Create Admin A
echo "1. Creating Admin A...\n";
$adminA = User::create([
    'name' => 'Test Admin A',
    'email' => 'admin_a_' . time() . '@test.com',
    'password' => Hash::make('password'),
    'role' => 'admin'
]);
$dbNameA = DatabaseService::generateDatabaseName($adminA->id, $adminA->email);
$adminA->update(['database_name' => $dbNameA]);
DatabaseService::createAdminDatabase($dbNameA);
echo "Admin A created with DB: {$dbNameA}\n";

// 2. Create Admin B
echo "\n2. Creating Admin B...\n";
$adminB = User::create([
    'name' => 'Test Admin B',
    'email' => 'admin_b_' . time() . '@test.com',
    'password' => Hash::make('password'),
    'role' => 'admin'
]);
$dbNameB = DatabaseService::generateDatabaseName($adminB->id, $adminB->email);
$adminB->update(['database_name' => $dbNameB]);
DatabaseService::createAdminDatabase($dbNameB);
echo "Admin B created with DB: {$dbNameB}\n";

// 3. Switch to Admin A and create data
echo "\n3. Switching to Admin A context...\n";
switchDatabase($adminA);

echo "Creating Job Posting for Admin A...\n";
// Note: JobPosting usually requires a company_id.
// In the admin database context, the users table might be empty or different.
// We might need to create a company in Admin A's DB first if foreign keys are enforced.
// Let's check if we can create a user in the current DB (Admin A's DB).

// Create a company in Admin A's DB
$companyA = User::create([
    'name' => 'Company A',
    'email' => 'comp_a@test.com',
    'password' => Hash::make('password'),
    'role' => 'company'
]);

$jobA = JobPosting::create([
    'company_id' => $companyA->id,
    'title' => 'Secret Job A',
    'description' => 'This is a secret job for Admin A',
    'position' => 'Developer',
    'location' => 'Jakarta',
    'job_type' => 'full-time',
    'status' => 'open'
]);
echo "Job Posting created: {$jobA->title} (ID: {$jobA->id})\n";

$countA = JobPosting::count();
echo "Total Job Postings in Admin A DB: {$countA}\n";

// 4. Switch to Admin B and verify isolation
echo "\n4. Switching to Admin B context...\n";
switchDatabase($adminB);

$countB = JobPosting::count();
echo "Total Job Postings in Admin B DB: {$countB}\n";

if ($countB === 0) {
    echo "SUCCESS: Admin B cannot see Admin A's data.\n";
} else {
    echo "FAILURE: Admin B found {$countB} job postings!\n";
    // List them to be sure
    foreach(JobPosting::all() as $job) {
        echo "- Found: {$job->title}\n";
    }
}

// 5. Switch back to Admin A to confirm data is still there
echo "\n5. Switching back to Admin A context...\n";
switchDatabase($adminA);
$countA_again = JobPosting::count();
echo "Total Job Postings in Admin A DB: {$countA_again}\n";

if ($countA_again === $countA) {
    echo "SUCCESS: Admin A's data is intact.\n";
} else {
    echo "FAILURE: Admin A's data changed!\n";
}

// 6. Cleanup
echo "\n6. Cleaning up...\n";
resetDatabase();

// Delete databases
echo "Deleting Admin A DB...\n";
DatabaseService::deleteAdminDatabase($dbNameA);
echo "Deleting Admin B DB...\n";
DatabaseService::deleteAdminDatabase($dbNameB);

// Delete users from main DB
echo "Deleting users from main DB...\n";
$adminA->delete();
$adminB->delete();

echo "\n--- TEST COMPLETED ---\n";
