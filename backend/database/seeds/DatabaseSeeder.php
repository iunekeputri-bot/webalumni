<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(CompanyAdminSeeder::class);
        $this->call(AlumniSeeder::class);
        $this->call(MessageSeeder::class);
        $this->call(JobPostingsSeeder::class);
    }
}
