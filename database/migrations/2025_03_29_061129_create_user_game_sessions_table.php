<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_game_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->integer('level')->default(1);
            $table->integer('current_row')->default(1);
            $table->integer('score')->default(0);
            $table->integer('streak')->default(0);
            $table->integer('hearts')->default(3);
            $table->enum('game_mode', ['normal', 'suddenDeath'])->default('normal');
            $table->boolean('is_active')->default(true);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_game_sessions');
    }
};
