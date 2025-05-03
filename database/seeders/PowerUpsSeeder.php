<?php

namespace Database\Seeders;

use App\Models\power_ups;
use Illuminate\Database\Seeder;

class PowerUpSeeder extends Seeder
{
    public function run(): void
    {
        $powerUps = [
            [
                'slug' => 'hint',
                'name' => 'Hint',
                'icon' => '/images/power-ups/hint.png',
                'description' => 'Reveals a hint about the correct answer'
            ],
            [
                'slug' => 'fifty-fifty',
                'name' => '50/50',
                'icon' => '/images/power-ups/fifty-fifty.png',
                'description' => 'Eliminates two incorrect answers'
            ],
            [
                'slug' => 'extra-heart',
                'name' => 'Extra Heart',
                'icon' => '/images/power-ups/extra-heart.png',
                'description' => 'Gives you an extra life'
            ],
            [
                'slug' => 'time-extension',
                'name' => 'Time Extension',
                'icon' => '/images/power-ups/time-extension.png',
                'description' => 'Adds 30 seconds to the timer'
            ]
        ];

        foreach ($powerUps as $powerUp) {
            power_ups::create($powerUp);
        }
    }
}