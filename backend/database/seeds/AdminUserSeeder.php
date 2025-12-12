<?php

use Illuminate\Database\Seeder;
use App\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('email', 'admin@example.com')->first();

        if (!$user) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]);
            $this->command->info('Admin user created.');
        } else {
            $user->role = 'admin';
            $user->save();
            $this->command->info('Admin user updated.');
        }
    }
}
