<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class CompanyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if test company already exists
        $exists = User::where('email', 'company@example.com')->exists();

        if (!$exists) {
            User::create([
                'name' => 'PT Teknologi Maju',
                'email' => 'company@example.com',
                'password' => Hash::make('password'),
                'role' => 'company',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info('Test company user created: company@example.com / password');
        } else {
            $this->command->info('Test company user already exists.');
        }
    }
}
