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
        Schema::create('user_session_answers', function (Blueprint $table) {
             $table->id();
            $table->foreignId('user_game_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('trivia_questions');
            $table->string('selected_answer')->nullable();
            $table->boolean('is_correct');
            $table->integer('points_earned')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_session_answers');
    }
};
