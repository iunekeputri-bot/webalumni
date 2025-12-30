<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            // Check if foreign key exists before dropping to avoid errors
            try {
                $table->dropForeign('alumni_user_id_foreign');
            } catch (\Exception $e) {
                // Ignore if it doesn't exist
            }
        });

        Schema::table('documents', function (Blueprint $table) {
            try {
                $table->dropForeign('documents_user_id_foreign');
            } catch (\Exception $e) {
                // Ignore
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We probably don't want to restore these given the architecture, 
        // but for completeness:
        Schema::table('alumni', function (Blueprint $table) {
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('documents', function (Blueprint $table) {
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
