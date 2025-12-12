<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== DATABASE MASTER: alumni_connect_hub ===\n\n";

// Count users
$users = DB::table('users')->get(['id', 'name', 'email', 'role', 'database_name']);
echo "USERS (" . count($users) . "):\n";
foreach ($users as $u) {
    $db = $u->database_name ?? 'master';
    echo "  - {$u->name} ({$u->email}) | Role: {$u->role} | DB: {$db}\n";
}

echo "\n";

// Count job postings
$jobs = DB::table('job_postings')->get(['id', 'title', 'location', 'status']);
echo "JOB POSTINGS (" . count($jobs) . "):\n";
foreach ($jobs as $j) {
    echo "  - [{$j->id}] {$j->title} | {$j->location} | Status: {$j->status}\n";
}

echo "\n";

// Count alumni in master
$alumni = DB::table('alumni')->get(['id', 'name', 'email', 'major']);
echo "ALUMNI in MASTER DB (" . count($alumni) . "):\n";
foreach ($alumni as $a) {
    echo "  - {$a->name} ({$a->email}) | {$a->major}\n";
}

echo "\n=== SUMMARY ===\n";
echo "Users: " . count($users) . "\n";
echo "Job Postings: " . count($jobs) . "\n";
echo "Alumni (in master): " . count($alumni) . "\n";
echo "\n--- END OF REPORT ---\n";
