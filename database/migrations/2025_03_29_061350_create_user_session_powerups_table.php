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
        Schema::create('user_session_powerups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_game_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('power_up_id')->constrained('power_ups');
            $table->boolean('is_used')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_session_powerups');
    }
};
