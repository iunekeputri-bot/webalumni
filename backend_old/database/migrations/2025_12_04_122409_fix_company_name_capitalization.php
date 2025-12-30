<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixCompanyNameCapitalization extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Fix capitalization of PT prefix for companies
        DB::statement("
            UPDATE users
            SET name = REPLACE(name, 'Pt. ', 'PT. ')
            WHERE role = 'company'
            AND name LIKE 'Pt. %'
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Reverse the capitalization fix
        DB::statement("
            UPDATE users
            SET name = REPLACE(name, 'PT. ', 'Pt. ')
            WHERE role = 'company'
            AND name LIKE 'PT. %'
        ");
    }
}
