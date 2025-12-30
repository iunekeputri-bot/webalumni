<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class AlumniTemplateExport implements FromArray, WithHeadings, WithTitle
{
    public function array(): array
    {
        return [
            ['John Doe', 'john@example.com', '2005-05-15', '1234567890', '081234567890', 'Teknik Komputer dan Jaringan', '2023', 'active'],
        ];
    }

    public function headings(): array
    {
        return [
            'name',
            'email',
            'birth_date',
            'nisn',
            'phone',
            'major',
            'graduation_year',
            'status',
        ];
    }

    public function title(): string
    {
        return 'Alumni Import Template';
    }
}

