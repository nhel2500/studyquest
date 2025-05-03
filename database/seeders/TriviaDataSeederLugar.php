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

    private function createLugarTriviaQuestion1($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'COMMON',
            'question' => 'Which Philippine province is known as the "Cradle of Philippine Independence"?',
            'correct_answer' => 'c',
            'reveal_text' => 'You found a COMMON collectible: "Kawit Independence Flag"! ✨

Cavite is known as the "Cradle of Philippine Independence" because it was in Kawit, Cavite where General Emilio Aguinaldo declared Philippine independence from Spain on June 12, 1898. The province was also home to many revolutionary leaders and was the site of numerous battles during the Philippine Revolution.',
            'streak_bonus' => 200,
            'row' => 1,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Batangas']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Bulacan']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Cavite']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Pampanga']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Kawit Independence Flag',
            'rarity' => 'COMMON',
            'image' => '/images/collectibles/kawit-flag.png',
            'description' => 'A replica of the Philippine flag first unfurled in Kawit, Cavite.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This province is located just south of Manila.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'General Emilio Aguinaldo hailed from this province.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'The Philippine Declaration of Independence was proclaimed in Kawit, a town in this province.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion2($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'RARE',
            'question' => 'Which ancient trading port in the Philippines was known to Chinese merchants as "Ma-yi" during the Song Dynasty?',
            'correct_answer' => 'a',
            'reveal_text' => 'You found a RARE collectible: "Ancient Ma-yi Trading Artifact"! ✨

Mindoro (then known as Ma-yi) was an important trading port mentioned in Chinese records as early as the 10th century. Chinese merchants sailed to Ma-yi to trade porcelain, silk, and other goods for gold, beeswax, and other local products. This ancient trade connection shows how the Philippines was already engaged in international commerce long before Spanish colonization!',
            'streak_bonus' => 300,
            'row' => 1,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Mindoro']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Cebu']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Butuan']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Palawan']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Ancient Ma-yi Trading Artifact',
            'rarity' => 'RARE',
            'image' => '/images/collectibles/ma-yi-artifact.png',
            'description' => 'An ancient trading item from the Ma-yi (Mindoro) port.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This location was mentioned in Chinese historical records from the Song Dynasty period.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'The name "Ma-yi" was the Chinese pronunciation for this island.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This island\'s name is believed to come from "Mina de Oro" (mine of gold) due to its gold deposits.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion3($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'VERY RARE',
            'question' => 'Which UNESCO World Heritage Site in the Philippines is known as the "Eighth Wonder of the World"?',
            'correct_answer' => 'c',
            'reveal_text' => 'You discovered a VERY RARE collectible: "Banaue Rice Terraces Model"! ✨✨

The Banaue Rice Terraces, built over 2,000 years ago by the Ifugao people, are sometimes called the "Eighth Wonder of the World" due to their remarkable engineering. Carved into the mountains of Ifugao province with minimal equipment, they follow the natural contours of the mountains and would stretch 22,000 kilometers if placed end to end! These terraces were designated as a UNESCO World Heritage Site in 1995.',
            'streak_bonus' => 500,
            'row' => 2,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Chocolate Hills']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Tubbataha Reef']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Banaue Rice Terraces']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Mayon Volcano']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Banaue Rice Terraces Model',
            'rarity' => 'VERY RARE',
            'image' => '/images/collectibles/banaue-model.png',
            'description' => 'A detailed model of the ancient Banaue Rice Terraces.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This site is over 2,000 years old and was built by indigenous people.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It\'s located in the mountainous Ifugao province in Northern Luzon.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This site features ancient agricultural structures built on mountain slopes.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion4($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'LEGENDARY',
            'question' => 'Which ancient Philippine city was so wealthy from trade that it was described in Chinese records as having houses "decked with gold" and rulers who wore gold-embroidered clothing?',
            'correct_answer' => 'd',
            'reveal_text' => '🌟 LEGENDARY COLLECTIBLE UNLOCKED: "Golden Butuan Artifact"! 🌟

Butuan, located in present-day Agusan del Norte, was a powerful and wealthy trading kingdom from the 10th to 13th centuries. Chinese records described Butuan\'s rulers and nobles wearing gold-embroidered clothing and living in gold-adorned houses. Archaeological excavations have confirmed its wealth, uncovering thousands of gold artifacts, including the famous Golden Tara statue, and the balangay boats that allowed Butuan to engage in extensive international trade across Southeast Asia!',
            'streak_bonus' => 1000,
            'row' => 2,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Manila']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Cebu']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Sulu']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Butuan']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Golden Butuan Artifact',
            'rarity' => 'LEGENDARY',
            'image' => '/images/collectibles/butuan-gold.png',
            'description' => 'A golden artifact from the ancient, wealthy kingdom of Butuan.',
            'bonus' => 'Unlocks "Ancient Trader" profile frame'
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This location was a major pre-colonial trading center.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It\'s located in Mindanao and was known for its gold and balangay boats.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This ancient kingdom is now a city in Agusan del Norte.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion5($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'NORMAL',
            'question' => 'Which Philippine volcano is known for having the world\'s most perfect cone shape?',
            'correct_answer' => 'b',
            'reveal_text' => 'You found a NORMAL collectible: "Mayon Volcano Miniature"! ✨

Mayon Volcano in Albay province is famous worldwide for its nearly perfect symmetrical cone shape. This active stratovolcano stands at 2,463 meters (8,081 ft) and has erupted over 50 times in the past 400 years. Its name comes from "Magayon," a beautiful maiden in Bicolano folklore, and it remains one of the Philippines\' most iconic natural landmarks.',
            'streak_bonus' => 100,
            'row' => 3,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Mount Pinatubo']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Mayon Volcano']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Taal Volcano']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Mount Apo']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Mayon Volcano Miniature',
            'rarity' => 'NORMAL',
            'image' => '/images/collectibles/mayon-miniature.png',
            'description' => 'A small model of the perfectly-shaped Mayon Volcano.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This natural landmark is located in the Bicol region.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'Its name comes from a Bicolano word meaning "beautiful".',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This active volcano has erupted over 50 times in recorded history.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion6($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'RARE',
            'question' => 'Which historic Manila district was once enclosed by walls and considered the original city founded by the Spanish in 1571?',
            'correct_answer' => 'a',
            'reveal_text' => 'You found a RARE collectible: "Intramuros Stone Wall Fragment"! ✨

Intramuros (Latin for "within the walls") was the original Manila founded by Spanish colonizers in 1571. Surrounded by massive stone walls that were 8 feet thick and 22 feet high, it served as the political, military, and religious center of Spanish rule in the Philippines for over 300 years. Despite heavy damage during World War II, some structures like San Agustin Church still stand today as reminders of this historic walled city.',
            'streak_bonus' => 300,
            'row' => 3,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Intramuros']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Binondo']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Ermita']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Quiapo']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Intramuros Stone Wall Fragment',
            'rarity' => 'RARE',
            'image' => '/images/collectibles/intramuros-stone.png',
            'description' => 'A piece of the historic walls that once surrounded Manila.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'The name of this district comes from Latin words meaning "within walls".',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'This area housed the Spanish Governor-General\'s palace for centuries.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This district contains historical landmarks like Fort Santiago and San Agustin Church.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion7($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'VERY RARE',
            'question' => 'Which underwater site in the Philippines contains the wrecks of Japanese ships sunk during World War II and is now a popular diving spot?',
            'correct_answer' => 'd',
            'reveal_text' => 'You discovered a VERY RARE collectible: "Coron Bay Shipwreck Relic"! ✨✨

Coron Bay in Palawan contains the wrecks of about 24 Japanese ships that were sunk by US Navy aircraft on September 24, 1944, during World War II. These remarkably well-preserved shipwrecks now form an underwater museum and have become one of the world\'s top wreck diving destinations. The clear waters and diverse marine life that now inhabit these wrecks create an eerie but beautiful underwater landscape for divers to explore!',
            'streak_bonus' => 500,
            'row' => 4,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Subic Bay']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Manila Bay']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Leyte Gulf']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Coron Bay']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Coron Bay Shipwreck Relic',
            'rarity' => 'VERY RARE',
            'image' => '/images/collectibles/coron-shipwreck.png',
            'description' => 'An artifact recovered from a WWII Japanese shipwreck in Coron.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This site is located in Palawan province.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'American planes sank around 24 Japanese vessels here in 1944.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This location is now considered one of the best wreck diving sites in the world.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion8($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'COMMON',
            'question' => 'Which Philippine city is known as the "Summer Capital of the Philippines" due to its cool climate?',
            'correct_answer' => 'b',
            'reveal_text' => 'You found a COMMON collectible: "Baguio Pine Cone"! ✨

Baguio City, located approximately 1,500 meters above sea level in the Cordillera Mountains, is known as the "Summer Capital of the Philippines" because of its cool climate. Many Filipinos travel to Baguio during the hot summer months to escape the heat of the lowlands. The city was designed by American architect Daniel Burnham and is known for its pine trees, parks, and strawberry farms.',
            'streak_bonus' => 200,
            'row' => 4,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Tagaytay']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Baguio']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Davao']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Cebu']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Baguio Pine Cone',
            'rarity' => 'COMMON',
            'image' => '/images/collectibles/baguio-pine-cone.png',
            'description' => 'A pine cone from the famous pine trees of Baguio City.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This city experiences temperatures much cooler than most parts of the Philippines.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It was designed by American architect Daniel Burnham in the early 1900s.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This city hosts the annual Panagbenga (Flower) Festival.',
            'cost' => 200,
        ]);
    }

    private function createLugarTriviaQuestion9($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'NORMAL',
            'question' => 'Which UNESCO World Heritage Site in the Philippines consists of baroque churches built during the Spanish colonial period?',
            'correct_answer' => 'a',
            'reveal_text' => 'You found a NORMAL collectible: "Baroque Churches Miniature Set"! ✨

The Baroque Churches of the Philippines is a UNESCO World Heritage Site consisting of four churches: San Agustin Church in Manila, Santa Maria Church in Ilocos Sur, Paoay Church in Ilocos Norte, and Miagao Church in Iloilo. These churches, built between the 16th and 18th centuries, represent the Spanish colonial influence on Filipino architecture and showcase a unique "Earthquake Baroque" style adapted to the seismic conditions of the Philippines.',
            'streak_bonus' => 100,
            'row' => 4,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Baroque Churches of the Philippines']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Historic City of Vigan']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Rice Terraces of the Philippine Cordilleras']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Puerto Princesa Subterranean River']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Baroque Churches Miniature Set',
            'rarity' => 'NORMAL',
            'image' => '/images/collectibles/baroque-churches.png',
            'description' => 'A collection of miniatures of the four UNESCO-listed baroque churches.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This UNESCO site consists of multiple locations across different provinces.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'These structures were built between the 16th and 18th centuries during Spanish colonization.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'San Agustin Church in Manila is one of the four structures included in this UNESCO site.',
            'cost' => 200,
        ]);
    }
    
}