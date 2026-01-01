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
        if (!Schema::hasTable('alumni')) {
            Schema::create('alumni', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable()->index(); // No FK to users table (cross-database)
                $table->string('name');
                $table->string('email')->index(); // No unique constraint at DB level for flexibility
                $table->date('birth_date')->nullable();
                $table->string('nisn')->nullable()->unique();
                $table->string('phone')->nullable();
                $table->string('major');
                $table->year('graduation_year');
                $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
                $table->date('join_date');
                $table->text('bio')->nullable();
                $table->text('skills')->nullable(); // JSON stored as text
                $table->string('work_status')->default('siap_bekerja');
                $table->string('avatar')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('documents')) {
            Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->index(); // No FK to users table (cross-database)
                $table->string('title');
                $table->string('file_name');
                $table->string('file_path');
                $table->string('file_type');
                $table->bigInteger('file_size');
                $table->string('mime_type')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('job_postings')) {
            Schema::create('job_postings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('company_id')->constrained('users')->onDelete('cascade'); // referencing users table for company
                $table->string('title');
                $table->text('description');
                $table->string('position');
                $table->string('location');
                $table->string('job_type');
                $table->string('salary_range')->nullable();
                $table->text('requirements')->nullable();
                $table->text('benefits')->nullable();
                $table->dateTime('deadline')->nullable();
                $table->enum('status', ['open', 'closed', 'draft'])->default('open');
                $table->integer('views')->unsigned()->default(0);
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('job_applications')) {
            Schema::create('job_applications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('job_posting_id')->constrained('job_postings')->onDelete('cascade');
                $table->foreignId('alumni_id')->constrained('alumni')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->text('cover_letter');
                $table->enum('status', ['pending', 'viewed', 'accepted', 'rejected'])->default('pending');
                $table->dateTime('reviewed_at')->nullable();
                $table->text('review_notes')->nullable();
                $table->timestamps();

                // Unique constraint to prevent double application
                $table->unique(['job_posting_id', 'user_id']);
            });
        }

        if (!Schema::hasTable('application_documents')) {
            Schema::create('application_documents', function (Blueprint $table) {
                $table->id();
                $table->foreignId('application_id')->constrained('job_applications')->onDelete('cascade');
                $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['application_id', 'document_id']);
            });
        }

        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
                $table->text('message');
                $table->enum('status', ['draft', 'sent', 'read'])->default('sent');
                $table->foreignId('job_application_id')->nullable()->constrained('job_applications')->onDelete('set null');
                $table->boolean('is_read')->default(false);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('job_views')) {
            Schema::create('job_views', function (Blueprint $table) {
                $table->id();
                $table->foreignId('job_posting_id')->constrained('job_postings')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->timestamp('viewed_at')->useCurrent();
                $table->timestamps();

                $table->unique(['job_posting_id', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_views');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('application_documents');
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('alumni');
    }
};
