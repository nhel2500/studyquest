<?php

namespace Database\Seeders;

use App\Models\trivia_categories;
use Illuminate\Database\Seeder;

class TriviaCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Bayani', 'tag_name' => 'Heroes'],
            ['name' => 'Lugar', 'tag_name' => 'Places'],
            ['name' => 'Dokumento', 'tag_name' => 'Documents'],
            ['name' => 'Pangyayari', 'tag_name' => 'Events'],
            ['name' => 'Petsa', 'tag_name' => 'Dates'],
        ];

        foreach ($categories as $category) {
            trivia_categories::create($category);
        }
    }
}