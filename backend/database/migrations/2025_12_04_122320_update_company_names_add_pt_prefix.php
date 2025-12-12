<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCompanyNamesAddPtPrefix extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Update company names that don't have PT prefix
        DB::statement("
            UPDATE users
            SET name = CONCAT('PT. ', name)
            WHERE role = 'company'
            AND name NOT REGEXP '^(PT\.?|Perseroan Terbatas|CV\.?|Koperasi)'
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Note: This migration updates data, reversing it would be complex
        // as we can't reliably determine which names originally had PT prefix
        // and which ones were added by this migration
    }
}
