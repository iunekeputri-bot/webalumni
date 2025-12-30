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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'industry')) {
                $table->string('industry')->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'website')) {
                $table->string('website')->nullable()->after('industry'); // Note: 'industry' might not act properly if it was just added in the same closure, but for schema changes usually it's fine or we align after 'role' if unsure. Let's stick to sequence but just check existence.
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('website');
            }
            if (!Schema::hasColumn('users', 'city')) {
                $table->string('city')->nullable()->after('address');
            }
            if (!Schema::hasColumn('users', 'description')) {
                $table->text('description')->nullable()->after('city');
            }
            if (!Schema::hasColumn('users', 'logo')) {
                $table->string('logo')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['phone', 'industry', 'website', 'address', 'city', 'description', 'logo'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
