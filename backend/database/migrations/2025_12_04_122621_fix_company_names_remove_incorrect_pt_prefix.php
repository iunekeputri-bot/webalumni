<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixCompanyNamesRemoveIncorrectPtPrefix extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Fix specific company names that were incorrectly given PT prefix
        // You can modify these based on the actual company types
        $companyFixes = [
            // ID => Correct Name
            // Add the correct names here based on actual company data
        ];

        foreach ($companyFixes as $id => $correctName) {
            DB::table('users')
                ->where('id', $id)
                ->where('role', 'company')
                ->update(['name' => $correctName]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
}
