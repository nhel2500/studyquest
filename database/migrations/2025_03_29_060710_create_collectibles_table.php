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
        Schema::create('collectibles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('trivia_questions')->cascadeOnDelete();
            $table->string('name');
            $table->enum('rarity', ['NORMAL', 'COMMON', 'RARE', 'VERY RARE', 'LEGENDARY']);
            $table->string('image');
            $table->text('bonus')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collectibles');
    }
};
