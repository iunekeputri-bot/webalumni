<?php

namespace App\Exports;

use App\Alumni;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AlumniExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Alumni::all();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Birth Date',
            'NISN',
            'Phone',
            'Major',
            'Graduation Year',
            'Status',
        ];
    }

    public function map($alumni): array
    {
        return [
            $alumni->name,
            $alumni->email,
            $alumni->birth_date,
            $alumni->nisn,
            $alumni->phone,
            $alumni->major,
            $alumni->graduation_year,
            $alumni->status,
        ];
    }
}
