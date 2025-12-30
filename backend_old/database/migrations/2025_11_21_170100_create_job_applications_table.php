<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_posting_id');
            $table->unsignedBigInteger('alumni_id');
            $table->unsignedBigInteger('user_id');
            $table->text('cover_letter');
            $table->enum('status', ['pending', 'viewed', 'accepted', 'rejected'])->default('pending');
            $table->dateTime('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('job_posting_id')
                  ->references('id')
                  ->on('job_postings')
                  ->onDelete('cascade');

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('alumni_id')
                  ->references('id')
                  ->on('alumni')
                  ->onDelete('cascade');

            // Indexes
            $table->index('job_posting_id');
            $table->index('user_id');
            $table->index('alumni_id');
            $table->index('status');
            $table->index('created_at');

            // Unique constraint to prevent duplicate applications
            $table->unique(['job_posting_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_applications');
    }
}
