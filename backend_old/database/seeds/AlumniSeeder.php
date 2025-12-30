<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AlumniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create test alumni accounts (these are sample accounts for testing)
        // In production, admin will create alumni accounts via the register endpoint
        $alumni = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
            [
                'name' => 'Ahmad Rahman',
                'email' => 'ahmad@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky@example.com',
                'password' => Hash::make('test1234'),
                'role' => 'alumni',
            ],
        ];

        foreach ($alumni as $alumnus) {
            $created = DB::table('users')->insertGetId([
                'name' => $alumnus['name'],
                'email' => $alumnus['email'],
                'password' => $alumnus['password'],
                'role' => $alumnus['role'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create corresponding alumni record
            DB::table('alumni')->insert([
                'user_id' => $created,
                'name' => $alumnus['name'],
                'email' => $alumnus['email'],
                'phone' => '08123456789' . rand(10, 99),
                'major' => ['Teknik Komputer dan Jaringan', 'Rekayasa Perangkat Lunak', 'Multimedia'][rand(0, 2)],
                'graduation_year' => rand(2018, 2023),
                'status' => 'active',
                'join_date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}



