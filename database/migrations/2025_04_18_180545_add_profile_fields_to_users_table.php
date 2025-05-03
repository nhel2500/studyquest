<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // $table->text('bio')->nullable();          // already exists
            // $table->string('profile_photo')->nullable();
            // $table->string('cover_photo')->nullable();
        });

    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'profile_photo', 'cover_photo']);
        });
    }
};

