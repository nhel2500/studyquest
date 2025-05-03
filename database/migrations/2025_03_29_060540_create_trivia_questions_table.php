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
        Schema::create('trivia_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('trivia_categories');
            $table->enum('rarity', ['NORMAL', 'COMMON', 'RARE', 'VERY RARE', 'LEGENDARY']);
            $table->text('question');
            $table->string('correct_answer'); // Reference to the option ID (a, b, c, d)
            $table->text('reveal_text');
            $table->integer('streak_bonus');
            $table->integer('row'); // row 1, 2, or 3
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trivia_questions');
    }
};
