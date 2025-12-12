<?php

use Illuminate\Database\Seeder;
use App\User;
use App\JobPosting;

class JobPostingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get or create a company user
        $company = User::where('role', 'company')->first();
        if (!$company) {
            $company = User::create([
                'name' => 'PT Maju Jaya',
                'email' => 'hr@majujaya.com',
                'password' => bcrypt('password'),
                'role' => 'company'
            ]);
        }

        // Create job postings
        JobPosting::create([
            'company_id' => $company->id,
            'title' => 'Senior Laravel Developer',
            'position' => 'Backend Developer',
            'description' => 'Kami mencari developer Laravel berpengalaman untuk bergabung dengan tim kami. Pengalaman minimal 3 tahun diperlukan.',
            'location' => 'Jakarta',
            'job_type' => 'full-time',
            'salary_range' => 'Rp 15-25 Juta',
            'requirements' => 'Laravel, PHP, MySQL, Git',
            'benefits' => 'Asuransi kesehatan, Bonus tahunan, WFH',
            'deadline' => now()->addDays(30),
            'status' => 'open'
        ]);

        JobPosting::create([
            'company_id' => $company->id,
            'title' => 'React Frontend Developer',
            'position' => 'Frontend Developer',
            'description' => 'Cari developer React untuk proyek exciting kami. Must have modern frontend experience.',
            'location' => 'Bandung',
            'job_type' => 'full-time',
            'salary_range' => 'Rp 12-20 Juta',
            'requirements' => 'React, TypeScript, Tailwind CSS',
            'benefits' => 'Flexible hours, Learning budget, Catering',
            'deadline' => now()->addDays(25),
            'status' => 'open'
        ]);

        JobPosting::create([
            'company_id' => $company->id,
            'title' => 'UI/UX Designer',
            'position' => 'Design',
            'description' => 'Cari designer berbakat untuk design mobile dan web applications kami.',
            'location' => 'Surabaya',
            'job_type' => 'part-time',
            'salary_range' => 'Rp 8-15 Juta',
            'requirements' => 'Figma, Adobe XD, UI/UX principles',
            'benefits' => 'Portfolio building, Flexible schedule',
            'deadline' => now()->addDays(20),
            'status' => 'open'
        ]);

        JobPosting::create([
            'company_id' => $company->id,
            'title' => 'Full Stack Developer (Node.js + React)',
            'position' => 'Full Stack Developer',
            'description' => 'Kami butuh developer yang bisa handle both frontend dan backend. Project kami menarik dan challenging.',
            'location' => 'Jakarta',
            'job_type' => 'full-time',
            'salary_range' => 'Rp 18-28 Juta',
            'requirements' => 'Node.js, React, MongoDB, Git',
            'benefits' => 'Stock options, Remote work, Team outing',
            'deadline' => now()->addDays(35),
            'status' => 'open'
        ]);

        echo "\nJob postings seeded successfully!\n";
    }
}
