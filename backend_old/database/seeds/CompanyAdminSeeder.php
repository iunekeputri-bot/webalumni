<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompanyAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'PT. Demo Indonesia',
                'email' => 'company@example.com',
                'password' => Hash::make('company123'),
                'role' => 'company',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin SMK',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
