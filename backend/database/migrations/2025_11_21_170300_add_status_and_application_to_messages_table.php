<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusAndApplicationToMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->enum('status', ['draft', 'sent', 'read'])->default('sent')->after('message');
            $table->unsignedBigInteger('job_application_id')->nullable()->after('status');

            $table->foreign('job_application_id')
                  ->references('id')
                  ->on('job_applications')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['job_application_id']);
            $table->dropColumn(['status', 'job_application_id']);
        });
    }
}
