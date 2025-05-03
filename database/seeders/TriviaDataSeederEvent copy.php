<?php

namespace Database\Seeders;

use App\Models\clues;
use App\Models\collectibles;
use App\Models\trivia_categories;
use App\Models\trivia_options;
use App\Models\trivia_questions;
use Illuminate\Database\Seeder;

class TriviaDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get category IDs
        $bayaniId = trivia_categories::where('name', 'Bayani')->first()->id;
        $lugarId = trivia_categories::where('name', 'Lugar')->first()->id;
        $dokumentoId = trivia_categories::where('name', 'Dokumento')->first()->id;
        $pangyayariId = trivia_categories::where('name', 'Pangyayari')->first()->id;
        $petsaId = trivia_categories::where('name', 'Petsa')->first()->id;

        // Create trivia questions, options, collectibles, and clues
        $this->createTriviaQuestion1($bayaniId);
        $this->createTriviaQuestion2($lugarId);
        $this->createTriviaQuestion3($dokumentoId);
        $this->createTriviaQuestion4($pangyayariId);
        $this->createTriviaQuestion5($petsaId);
        $this->createTriviaQuestion6($bayaniId);
        $this->createTriviaQuestion7($lugarId);
        $this->createTriviaQuestion8($pangyayariId);
        $this->createTriviaQuestion9($dokumentoId);
    }

    
}