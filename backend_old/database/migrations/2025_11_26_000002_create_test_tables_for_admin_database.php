<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestTablesForAdminDatabase extends Migration
{
    /**
     * Run the migrations untuk database admin.
     * Ini dijalankan otomatis ketika database admin diciptakan.
     *
     * @return void
     */
    public function up()
    {
        // Users table
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('role')->default('alumni'); // admin, alumni, company
                $table->string('database_name')->nullable();
                $table->timestamp('database_created_at')->nullable();
                $table->rememberToken();
                $table->timestamps();

                $table->index('role');
                $table->index('email');
            });
        }

        // Alumni table
        if (!Schema::hasTable('alumni')) {
            Schema::create('alumni', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('major')->nullable();
                $table->year('graduation_year')->nullable();
                $table->string('current_position')->nullable();
                $table->string('company')->nullable();
                $table->string('phone')->nullable();
                $table->text('bio')->nullable();
                $table->string('avatar')->nullable();
                $table->string('linkedin_profile')->nullable();
                $table->date('birth_date')->nullable();
                $table->string('nisn')->nullable();
                $table->string('address')->nullable();
                $table->string('city')->nullable();
                $table->string('province')->nullable();
                $table->string('postal_code')->nullable();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index('graduation_year');
            });
        }

        // Messages table
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('sender_id');
                $table->unsignedBigInteger('receiver_id');
                $table->text('message');
                $table->string('status')->default('sent');
                $table->boolean('is_application_message')->default(false);
                $table->unsignedBigInteger('application_id')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamps();

                $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');
                $table->index(['sender_id', 'receiver_id']);
                $table->index('status');
            });
        }

        // Job Postings table
        if (!Schema::hasTable('job_postings')) {
            Schema::create('job_postings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('company_id');
                $table->string('title');
                $table->text('description');
                $table->string('location');
                $table->string('salary_range')->nullable();
                $table->string('job_type')->nullable(); // full-time, part-time, contract
                $table->string('experience_level')->nullable(); // entry, mid, senior
                $table->date('deadline');
                $table->timestamps();
                $table->softDeletes();

                $table->foreign('company_id')->references('id')->on('users')->onDelete('cascade');
                $table->index('company_id');
                $table->index('deadline');
            });
        }

        // Job Applications table
        if (!Schema::hasTable('job_applications')) {
            Schema::create('job_applications', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('job_posting_id');
                $table->unsignedBigInteger('user_id');
                $table->text('cover_letter')->nullable();
                $table->string('status')->default('pending'); // pending, reviewed, accepted, rejected
                $table->timestamps();

                $table->foreign('job_posting_id')->references('id')->on('job_postings')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index(['job_posting_id', 'user_id']);
                $table->index('status');
            });
        }

        // Documents table
        if (!Schema::hasTable('documents')) {
            Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('name');
                $table->string('type'); // CV, certificate, etc
                $table->string('file_path');
                $table->string('mime_type');
                $table->unsignedBigInteger('file_size');
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->index('user_id');
                $table->index('type');
            });
        }

        // Application Documents table
        if (!Schema::hasTable('application_documents')) {
            Schema::create('application_documents', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('application_id');
                $table->unsignedBigInteger('document_id');
                $table->timestamps();

                $table->foreign('application_id')->references('id')->on('job_applications')->onDelete('cascade');
                $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('application_documents');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('alumni');
        Schema::dropIfExists('users');
    }
}
