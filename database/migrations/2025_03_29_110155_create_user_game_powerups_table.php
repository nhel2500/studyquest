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
        Schema::create('user_game_powerups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_game_session_id')->constrained('user_game_sessions')->onDelete('cascade');
            $table->foreignId('power_up_id')->constrained('power_ups')->onDelete('cascade');
            $table->boolean('is_used')->default(false);
            $table->timestamps();
            
            // Add a unique constraint to prevent duplicates
            $table->unique(['user_game_session_id', 'power_up_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_game_powerups');
    }
};
