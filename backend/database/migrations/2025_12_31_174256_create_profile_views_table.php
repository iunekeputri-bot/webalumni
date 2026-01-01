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
        Schema::create('profile_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_id')->constrained('alumni')->onDelete('cascade');
            $table->foreignId('viewer_id')->constrained('users')->onDelete('cascade'); // Company or other user who viewed
            $table->timestamp('viewed_at')->useCurrent();
            $table->timestamps();

            // Prevent spam views: Unique per day per viewer per alumni?
            // Or just allow simple log. Let's start with simple log but maybe index for speed
            $table->index(['alumni_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_views');
    }
};
