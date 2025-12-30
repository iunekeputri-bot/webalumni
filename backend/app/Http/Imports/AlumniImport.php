<?php

namespace App\Imports;

use App\Models\Alumni;
use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Facades\Hash;

class AlumniImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        // Normalize birth_date to YYYY-MM-DD format
        $birthDate = null;
        if (isset($row['birth_date']) && !empty($row['birth_date'])) {
            // Handle Excel serial date number
            if (is_numeric($row['birth_date'])) {
                try {
                    $birthDate = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['birth_date'])->format('Y-m-d');
                } catch (\Exception $e) {
                    $birthDate = null;
                }
            } else {
                // Try to parse various date formats
                $dateString = trim($row['birth_date']);
                
                // Try YYYY-MM-DD format first
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateString)) {
                    $birthDate = $dateString;
                }
                // Try MM/DD/YYYY or DD/MM/YYYY format
                else if (preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $dateString)) {
                    try {
                        $parsed = \DateTime::createFromFormat('m/d/Y', $dateString);
                        if (!$parsed) {
                            $parsed = \DateTime::createFromFormat('d/m/Y', $dateString);
                        }
                        if ($parsed) {
                            $birthDate = $parsed->format('Y-m-d');
                        }
                    } catch (\Exception $e) {
                        $birthDate = null;
                    }
                }
                // Try other formats using strtotime
                else {
                    try {
                        $timestamp = strtotime($dateString);
                        if ($timestamp !== false) {
                            $birthDate = date('Y-m-d', $timestamp);
                        }
                    } catch (\Exception $e) {
                        $birthDate = null;
                    }
                }
            }
        }

        // Create User first
        // Default password is birth_date (YYYYMMDD) or '12345678' if not provided
        $password = $birthDate ? date('Ymd', strtotime($birthDate)) : '12345678';

        $user = User::create([
            'name'     => $row['name'],
            'email'    => $row['email'],
            'password' => Hash::make($password),
            'role'     => 'alumni',
        ]);

        // Create Alumni linked to User
        return new Alumni([
            'user_id'         => $user->id,
            'name'            => $row['name'],
            'email'           => $row['email'],
            'birth_date'      => $birthDate,
            'nisn'            => $row['nisn'] ?? null,
            'phone'           => $row['phone'] ?? null,
            'major'           => $row['major'] ?? null,
            'graduation_year' => $row['graduation_year'] ?? date('Y'),
            'status'          => $row['status'] ?? 'active',
            'join_date'       => now(),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'nisn' => 'required|unique:alumni,nisn',
            'major' => 'required',
            'graduation_year' => 'required|numeric',
            'birth_date' => 'required',
            'status' => 'nullable|in:active,inactive,pending',
        ];
    }
}


