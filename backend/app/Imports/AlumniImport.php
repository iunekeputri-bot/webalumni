<?php

namespace App\Imports;

use App\Models\Alumni;
use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AlumniImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Clean up data
        $email = trim($row['email'] ?? '');
        $name = trim($row['name'] ?? '');

        if (empty($email) || empty($name)) {
            return null;
        }

        // Skip if email already exists
        if (User::where('email', $email)->exists()) {
            return null;
        }

        // Determine birth date for password
        try {
            $birthDate = isset($row['birth_date']) ? Carbon::parse($row['birth_date']) : now();
        } catch (\Exception $e) {
            $birthDate = now();
        }

        // Password default: YYYYMMDD
        $password = $birthDate->format('Ymd');

        // Create User
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'alumni',
        ]);

        // Create Alumni linked to User
        return new Alumni([
            'user_id' => $user->id,
            'name' => $name,
            'email' => $email,
            'birth_date' => $birthDate->format('Y-m-d'),
            'nisn' => $row['nisn'] ?? null,
            'phone' => $row['phone'] ?? null,
            'major' => $row['major'] ?? 'General',
            'graduation_year' => $row['graduation_year'] ?? date('Y'),
            'status' => $row['status'] ?? 'active',
            'join_date' => now(),
            'work_status' => 'siap_bekerja',
        ]);
    }
}
