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




            // Lugar questions
            $this->createLugarTriviaQuestion1($lugarId);
            $this->createLugarTriviaQuestion2($lugarId);
            $this->createLugarTriviaQuestion3($lugarId);
            $this->createLugarTriviaQuestion4($lugarId);
            $this->createLugarTriviaQuestion5($lugarId);
            $this->createLugarTriviaQuestion6($lugarId);
            $this->createLugarTriviaQuestion7($lugarId);
            $this->createLugarTriviaQuestion8($lugarId);
            $this->createLugarTriviaQuestion9($lugarId);




            // Pangyayari questions
            $this->createPangyayariTriviaQuestion1($pangyayariId);
            $this->createPangyayariTriviaQuestion2($pangyayariId);
            $this->createPangyayariTriviaQuestion3($pangyayariId);
            $this->createPangyayariTriviaQuestion4($pangyayariId);
            $this->createPangyayariTriviaQuestion5($pangyayariId);
            $this->createPangyayariTriviaQuestion6($pangyayariId);
            $this->createPangyayariTriviaQuestion7($pangyayariId);
            $this->createPangyayariTriviaQuestion8($pangyayariId);
            $this->createPangyayariTriviaQuestion9($pangyayariId);


            // Petsa questions
            $this->createPetsaTriviaQuestion1($petsaId);
            $this->createPetsaTriviaQuestion2($petsaId);
            $this->createPetsaTriviaQuestion3($petsaId);
            $this->createPetsaTriviaQuestion4($petsaId);
            $this->createPetsaTriviaQuestion5($petsaId);
            $this->createPetsaTriviaQuestion6($petsaId);
            $this->createPetsaTriviaQuestion7($petsaId);
            $this->createPetsaTriviaQuestion8($petsaId);
            $this->createPetsaTriviaQuestion9($petsaId);
            $this->createPetsaTriviaQuestion10($petsaId);





            // Dokumento (Documents) questions
            $this->createDokumentoTriviaQuestion1($dokumentoId);
            $this->createDokumentoTriviaQuestion2($dokumentoId);
            $this->createDokumentoTriviaQuestion3($dokumentoId);
            $this->createDokumentoTriviaQuestion4($dokumentoId);
            $this->createDokumentoTriviaQuestion5($dokumentoId);
            $this->createDokumentoTriviaQuestion6($dokumentoId);
            $this->createDokumentoTriviaQuestion7($dokumentoId);
            $this->createDokumentoTriviaQuestion8($dokumentoId);
            $this->createDokumentoTriviaQuestion9($dokumentoId);
            $this->createDokumentoTriviaQuestion10($dokumentoId);




            $this->createBayaniTriviaQuestion1($bayaniId);
            $this->createBayaniTriviaQuestion2($bayaniId);
            $this->createBayaniTriviaQuestion3($bayaniId);
            $this->createBayaniTriviaQuestion4($bayaniId);
            $this->createBayaniTriviaQuestion5($bayaniId);
            $this->createBayaniTriviaQuestion6($bayaniId);
            $this->createBayaniTriviaQuestion7($bayaniId);
            $this->createBayaniTriviaQuestion8($bayaniId);
            $this->createBayaniTriviaQuestion9($bayaniId);
            $this->createBayaniTriviaQuestion10($bayaniId);
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
    private function createLugarTriviaQuestion10($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'VERY RARE',
            'question' => 'Which historic city in the Philippines is known as the "Heritage City of the North" and is a UNESCO World Heritage Site?',
            'correct_answer' => 'c',
            'reveal_text' => 'You discovered a VERY RARE collectible: "Vigan Heritage Kalesa"! ✨✨

    Vigan, located in Ilocos Sur, is known as the "Heritage City of the North" and was designated as a UNESCO World Heritage Site in 1999. It\'s one of the best-preserved examples of a Spanish colonial town in Asia, with its unique architecture blending European colonial elements with Asian building designs. Vigan\'s cobblestone streets, ancestral houses, and horse-drawn kalesas (carriages) transport visitors back to the colonial era, making it a living museum of Philippine history.',
            'streak_bonus' => 500,
            'row' => 5,
        ]);

        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Cebu City']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Davao City']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Vigan City']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Zamboanga City']);

        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Vigan Heritage Kalesa',
            'rarity' => 'VERY RARE',
            'image' => '/images/collectibles/vigan-kalesa.png',
            'description' => 'A miniature of the iconic horse-drawn carriage from Vigan\'s historic Calle Crisologo.',
            'bonus' => null,
        ]);

        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This city is located in the Ilocos Region of northern Luzon.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It was recognized as a UNESCO World Heritage Site in 1999 for its well-preserved Spanish colonial architecture.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This city is famous for its cobblestone streets, ancestral houses, and horse-drawn carriages called "kalesas".',
            'cost' => 200,
        ]);
    }





















    private function createPangyayariTriviaQuestion1($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'COMMON',
            'question' => 'What major event happened on June 12, 1898, in Kawit, Cavite?',
            'correct_answer' => 'b',
            'reveal_text' => 'You found a COMMON collectible: "Independence Proclamation Document"! ✨
    
    On June 12, 1898, General Emilio Aguinaldo proclaimed the independence of the Philippines from Spain in Kawit, Cavite. This historic event marked the birth of the Philippine Republic, with the unfurling of the Philippine flag for the first time and the playing of the Marcha Nacional Filipina (now Lupang Hinirang). This date is now celebrated as Philippine Independence Day.',
            'streak_bonus' => 200,
            'row' => 1,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'The Cry of Pugad Lawin']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'The Declaration of Philippine Independence']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'The Pact of Biak-na-Bato']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'The First Philippine Assembly']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Independence Proclamation Document',
            'rarity' => 'COMMON',
            'image' => '/images/collectibles/independence-document.png',
            'description' => 'A replica of the 1898 Philippine Declaration of Independence.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This event occurred during the Spanish-American War.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'General Emilio Aguinaldo played a key role in this event.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This date is now celebrated as a national holiday in the Philippines.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion2($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'RARE',
            'question' => 'What was the main reason behind the execution of the Gomburza priests in 1872?',
            'correct_answer' => 'b',
            'reveal_text' => 'You found a RARE collectible: "Gomburza Martyrdom Medallion"! ✨
    
    The Gomburza priests (Fathers Mariano Gomez, Jose Burgos, and Jacinto Zamora) were executed by Spanish authorities on February 17, 1872, after being falsely accused of instigating the Cavite Mutiny. Their martyrdom sparked nationalist sentiments among Filipinos, including the young Jose Rizal, and is considered one of the catalysts that eventually led to the Philippine Revolution against Spain.',
            'streak_bonus' => 300,
            'row' => 1,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'They led the Katipunan revolt']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'They were accused of instigating the Cavite Mutiny']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'They supported the American occupation']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'They opposed the Spanish friars']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Gomburza Martyrdom Medallion',
            'rarity' => 'RARE',
            'image' => '/images/collectibles/gomburza-medallion.png',
            'description' => 'A commemorative medallion honoring the martyrdom of the Gomburza priests.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This event occurred in 1872 and involved three Filipino Catholic priests.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'The priests were executed by garrote at Bagumbayan (now Luneta Park).',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'Their execution was based on false accusations related to a military uprising in Cavite.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion3($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'VERY RARE',
            'question' => 'What historic event took place on March 16, 1521?',
            'correct_answer' => 'b',
            'reveal_text' => 'You discovered a VERY RARE collectible: "Magellan\'s Navigation Chart"! ✨✨
    
    On March 16, 1521, Portuguese explorer Ferdinand Magellan, sailing for Spain, arrived in the Philippines, making the first recorded European contact with the archipelago. His fleet anchored off the island of Homonhon in Eastern Samar, where they were welcomed by the natives. This encounter marked the beginning of European influence in the Philippines and eventually led to over 300 years of Spanish colonization.',
            'streak_bonus' => 500,
            'row' => 2,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'The signing of the Treaty of Paris']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'The arrival of Ferdinand Magellan in the Philippines']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'The execution of José Rizal']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'The establishment of Intramuros']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Magellan\'s Navigation Chart',
            'rarity' => 'VERY RARE',
            'image' => '/images/collectibles/magellan-chart.png',
            'description' => 'A replica of the navigation chart used by Ferdinand Magellan to reach the Philippines.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This event marked the first recorded European contact with the Philippines.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It involved a Portuguese explorer sailing for Spain.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'The explorer\'s fleet anchored off the island of Homonhon in Eastern Samar.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion4($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'LEGENDARY',
            'question' => 'What was the significance of the Battle of Mactan on April 27, 1521?',
            'correct_answer' => 'b',
            'reveal_text' => '🌟 LEGENDARY COLLECTIBLE UNLOCKED: "Lapu-Lapu\'s Ancient Weapon"! 🌟
    
    The Battle of Mactan on April 27, 1521, was the first recorded instance of native resistance against foreign invaders in Philippine history. Led by Datu Lapu-Lapu, the warriors of Mactan defeated the Spanish forces and killed Ferdinand Magellan. This victory delayed Spanish colonization by more than 40 years and established Lapu-Lapu as the first Filipino hero who successfully resisted foreign conquest, becoming a powerful symbol of Filipino independence and courage.',
            'streak_bonus' => 1000,
            'row' => 2,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'It marked the start of Spanish colonization']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'It was the first Filipino victory against foreign invaders']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'It led to the fall of the Spanish empire']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'It allowed Magellan to complete his voyage']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Lapu-Lapu\'s Ancient Weapon',
            'rarity' => 'LEGENDARY',
            'image' => '/images/collectibles/lapu-lapu-weapon.png',
            'description' => 'A representation of the weapon used by Lapu-Lapu in the Battle of Mactan.',
            'bonus' => 'Unlocks "Warrior of Mactan" profile frame'
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This battle took place just weeks after Magellan arrived in the Philippines.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'A native chief named Lapu-Lapu led his warriors against the Spanish forces.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'Ferdinand Magellan was killed during this battle.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion5($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'RARE',
            'question' => 'Which agreement led to the end of the Philippine Revolution in 1897?',
            'correct_answer' => 'b',
            'reveal_text' => 'You found a RARE collectible: "Biak-na-Bato Treaty Document"! ✨
    
    The Pact of Biak-na-Bato, signed on December 14, 1897, temporarily ended the Philippine Revolution against Spain. Under this agreement, Emilio Aguinaldo and other revolutionary leaders agreed to exile in Hong Kong in exchange for financial compensation and promises of reforms from Spain. However, Spain failed to fulfill many of its promises, and the revolution was later resumed when Aguinaldo returned during the Spanish-American War in 1898.',
            'streak_bonus' => 300,
            'row' => 3,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Treaty of Paris']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Pact of Biak-na-Bato']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Tydings-McDuffie Act']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Jones Law']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Biak-na-Bato Treaty Document',
            'rarity' => 'RARE',
            'image' => '/images/collectibles/biak-na-bato.png',
            'description' => 'A reproduction of the historic Pact of Biak-na-Bato that temporarily ended the revolution.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This agreement was signed in December 1897.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It led to Emilio Aguinaldo\'s exile to Hong Kong.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'The agreement was named after a revolutionary base in San Miguel, Bulacan.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion6($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'NORMAL',
            'question' => 'What was the main purpose of the Katipunan when it was founded in 1892?',
            'correct_answer' => 'c',
            'reveal_text' => 'You found a NORMAL collectible: "Katipunan Membership Card"! ✨
    
    The Katipunan (full name: Kataas-taasang, Kagalang-galangang Katipunan ng mga Anak ng Bayan) was a revolutionary society founded by Andres Bonifacio on July 7, 1892. Its main purpose was to fight for Philippine independence from Spanish colonial rule through armed revolution. The organization used secret codes, conducted blood compacts, and employed a complex system of ranks and rituals. It was the Katipunan\'s discovery by Spanish authorities that ignited the Philippine Revolution in 1896.',
            'streak_bonus' => 100,
            'row' => 3,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'To support Spanish rule']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'To promote education']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'To fight for Philippine independence']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'To expand the Catholic religion']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Katipunan Membership Card',
            'rarity' => 'NORMAL',
            'image' => '/images/collectibles/katipunan-card-alt.png',
            'description' => 'A replica membership card of the revolutionary Katipunan society.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This organization was founded by Andres Bonifacio.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It was a secret society with rituals including blood compacts.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'The discovery of this organization by Spanish authorities triggered the Philippine Revolution in 1896.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion7($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'COMMON',
            'question' => 'What was the first battle between Filipino revolutionaries and Spanish forces in 1896?',
            'correct_answer' => 'c',
            'reveal_text' => 'You found a COMMON collectible: "Battle of Pinaglabanan Map"! ✨
    
    The Battle of Pinaglabanan (or Battle of San Juan del Monte) was the first major battle of the Philippine Revolution, fought on August 30, 1896. Led by Andres Bonifacio, Filipino revolutionaries attacked the Spanish powder magazine and water station in San Juan del Monte (now San Juan City). Although the revolutionaries were defeated, this battle signaled the start of open warfare against Spanish rule and sparked similar uprisings across Luzon.',
            'streak_bonus' => 200,
            'row' => 4,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Battle of Mactan']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Battle of Tirad Pass']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Battle of Pinaglabanan']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Battle of Balangiga']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Battle of Pinaglabanan Map',
            'rarity' => 'COMMON',
            'image' => '/images/collectibles/pinaglabanan-map.png',
            'description' => 'A tactical map showing the first major battle of the Philippine Revolution.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This battle occurred just days after the discovery of the Katipunan in August 1896.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'The battle was led by Andres Bonifacio in what is now San Juan City.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'The Filipino revolutionaries attempted to capture a Spanish powder magazine during this battle.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion8($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'VERY RARE',
            'question' => 'What event led to the outbreak of the Philippine-American War in 1899?',
            'correct_answer' => 'c',
            'reveal_text' => 'You discovered a VERY RARE collectible: "San Juan Bridge Bullet Casing"! ✨✨
    
    The Philippine-American War began on February 4, 1899, when American Private William Grayson shot and killed a Filipino soldier crossing San Juan Bridge. This incident occurred after tensions had been building between Filipino forces, who had declared independence, and American troops, who had taken control of Manila following the Spanish-American War. The war lasted for three years officially, though resistance continued until 1913, resulting in hundreds of thousands of Filipino casualties.',
            'streak_bonus' => 500,
            'row' => 4,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'The signing of the Treaty of Paris']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'The assassination of Antonio Luna']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'The killing of a Filipino soldier on San Juan Bridge']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'The declaration of martial law by the Americans']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'San Juan Bridge Bullet Casing',
            'rarity' => 'VERY RARE',
            'image' => '/images/collectibles/san-juan-bullet.png',
            'description' => 'A replica of the bullet casing from the first shot of the Philippine-American War.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This event occurred on February 4, 1899.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It involved an American soldier named Private William Grayson.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This incident took place at a specific crossing in what is now part of Metro Manila.',
            'cost' => 200,
        ]);
    }
    
    private function createPangyayariTriviaQuestion9($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'NORMAL',
            'question' => 'Which event marked the surrender of the Philippines to Japan in 1942?',
            'correct_answer' => 'c',
            'reveal_text' => 'You found a NORMAL collectible: "Corregidor Surrender Flag"! ✨
    
    The Fall of Corregidor on May 6, 1942, marked the complete surrender of American and Filipino forces to Japan during World War II. After the fall of Bataan in April, Corregidor (nicknamed "The Rock") was the last Allied stronghold in the Philippines. When it fell, General Jonathan Wainwright was forced to surrender all remaining forces in the Philippines, beginning the Japanese occupation that lasted until 1945.',
            'streak_bonus' => 100,
            'row' => 4,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'The Death March']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'The Battle of Bataan']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'The Fall of Corregidor']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'The Liberation of Manila']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'Corregidor Surrender Flag',
            'rarity' => 'NORMAL',
            'image' => '/images/collectibles/corregidor-flag.png',
            'description' => 'A representation of the white flag raised on Corregidor Island after its fall.',
            'bonus' => null,
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This event occurred in May 1942, during World War II.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It took place on an island fortress at the entrance of Manila Bay.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'General Jonathan Wainwright was forced to surrender to Japanese forces in this event.',
            'cost' => 200,
        ]);
    }
    private function createPangyayariTriviaQuestion10($categoryId): void
    {
        // Create question
        $question = trivia_questions::create([
            'category_id' => $categoryId,
            'rarity' => 'LEGENDARY',
            'question' => 'What historic event in 1986 peacefully overthrew President Ferdinand Marcos after 21 years in power?',
            'correct_answer' => 'a',
            'reveal_text' => '🌟 LEGENDARY COLLECTIBLE UNLOCKED: "People Power Yellow Ribbon"! 🌟
    
    The People Power Revolution (also known as the EDSA Revolution) was a series of peaceful demonstrations in Metro Manila from February 22-25, 1986, that overthrew President Ferdinand Marcos after 21 years in power, including 9 years of martial law. Millions of Filipinos gathered along Epifanio de los Santos Avenue (EDSA) in a remarkable display of nonviolent protest, prompted by the assassination of opposition leader Benigno Aquino Jr. and allegations of election fraud. This revolution restored democracy to the Philippines and installed Corazon Aquino as president, becoming an inspiration for nonviolent movements worldwide.',
            'streak_bonus' => 1000,
            'row' => 5,
        ]);
    
        // Create options
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'The People Power Revolution']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'The Philippine Revolution']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'The First Quarter Storm']);
        trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'The Philippine Uprising']);
    
        // Create collectible
        collectibles::create([
            'question_id' => $question->id,
            'name' => 'People Power Yellow Ribbon',
            'rarity' => 'LEGENDARY',
            'image' => '/images/collectibles/yellow-ribbon.png',
            'description' => 'A symbolic yellow ribbon from the 1986 People Power Revolution that restored democracy.',
            'bonus' => 'Unlocks "Democracy Restored" profile frame'
        ]);
    
        // Create clues
        clues::create([
            'question_id' => $question->id,
            'level' => 1,
            'text' => 'This event occurred in February 1986 and involved millions of Filipinos gathering peacefully.',
            'cost' => 0,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 2,
            'text' => 'It took place primarily along Epifanio de los Santos Avenue (EDSA) in Metro Manila.',
            'cost' => 100,
        ]);
        clues::create([
            'question_id' => $question->id,
            'level' => 3,
            'text' => 'This peaceful revolution led to Corazon Aquino becoming president and is symbolized by the color yellow.',
            'cost' => 200,
        ]);
    }


















    private function createPetsaTriviaQuestion1($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'COMMON',
        'question' => 'On what date was Philippine Independence declared?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a COMMON collectible: "June 12 Commemorative Coin"! ✨

On June 12, 1898, General Emilio Aguinaldo proclaimed the independence of the Philippines from Spain in Kawit, Cavite. The Philippine flag was unfurled for the first time during this historic event, and the Philippine national anthem (then called "Marcha Nacional Filipina") was played. Though the Spanish never recognized this declaration and later ceded the Philippines to the United States, June 12 is officially celebrated as Philippine Independence Day.',
        'streak_bonus' => 200,
        'row' => 1,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'July 4, 1946']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'June 12, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'August 30, 1896']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'December 30, 1896']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'June 12 Commemorative Coin',
        'rarity' => 'COMMON',
        'image' => '/images/collectibles/independence-coin.png',
        'description' => 'A commemorative coin celebrating the declaration of Philippine Independence.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This date is now celebrated as a national holiday in the Philippines.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'The declaration took place in Kawit, Cavite.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'The Philippine flag was unfurled for the first time during this event.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion2($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'RARE',
        'question' => 'When was José Rizal executed in Bagumbayan?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a RARE collectible: "Rizal\'s Last Moments Watch"! ✨

José Rizal, the Philippines\' national hero, was executed by firing squad at Bagumbayan (now Luneta Park) on December 30, 1896. He was charged with rebellion, sedition, and conspiracy after the outbreak of the Philippine Revolution, largely due to his writings that inspired Filipino nationalism. The night before his execution, he wrote "Mi Último Adiós" (My Last Farewell), a poem expressing his love for the Philippines. His martyrdom further inflamed the revolutionary sentiment among Filipinos.',
        'streak_bonus' => 300,
        'row' => 1,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'June 19, 1861']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'December 30, 1896']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'November 15, 1935']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'September 21, 1972']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Rizal\'s Last Moments Watch',
        'rarity' => 'RARE',
        'image' => '/images/collectibles/rizal-watch.png',
        'description' => 'A pocket watch depicting the time of Rizal\'s execution at Bagumbayan.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This date is now commemorated as Rizal Day, a national holiday.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'The night before this event, Rizal wrote "Mi Último Adiós" (My Last Farewell).',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'His execution took place at Bagumbayan, which is now known as Luneta Park.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion3($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'NORMAL',
        'question' => 'What year did the Philippine Revolution against Spain begin?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a NORMAL collectible: "Revolution Year Medal"! ✨

The Philippine Revolution against Spain began in 1896, following the discovery of the Katipunan secret society by Spanish authorities. On August 23, 1896, Andres Bonifacio and his followers performed the "Cry of Pugad Lawin," tearing their cedulas (tax certificates) as a symbol of their rebellion against Spanish rule. The revolution would continue until 1898, when Spain ceded the Philippines to the United States through the Treaty of Paris.',
        'streak_bonus' => 100,
        'row' => 2,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => '1521']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => '1896']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => '1941']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => '1935']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Revolution Year Medal',
        'rarity' => 'NORMAL',
        'image' => '/images/collectibles/revolution-medal.png',
        'description' => 'A medal commemorating the year the Philippine Revolution began.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This was the same year José Rizal was executed.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'The Katipunan secret society was discovered by Spanish authorities this year.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'The Cry of Pugad Lawin occurred in August of this year.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion4($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'RARE',
        'question' => 'On what date did the Cry of Pugad Lawin happen, marking the start of the revolution?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a RARE collectible: "Torn Cedula Fragment"! ✨

The Cry of Pugad Lawin (also known as the Cry of Balintawak) occurred on August 23, 1896, when Andres Bonifacio and his fellow Katipuneros tore their cedulas (tax certificates) as a symbolic act of rebellion against Spanish colonial rule. This event marked the beginning of the Philippine Revolution. After discovering the Katipunan, Spanish authorities began arresting suspected members, prompting Bonifacio to call for an armed uprising rather than be captured without resistance.',
        'streak_bonus' => 300,
        'row' => 2,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'June 12, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'August 23, 1896']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'September 21, 1972']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'December 10, 1898']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Torn Cedula Fragment',
        'rarity' => 'RARE',
        'image' => '/images/collectibles/torn-cedula.png',
        'description' => 'A fragment of a torn cedula (tax certificate) from the Cry of Pugad Lawin.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This event involved Andres Bonifacio and other Katipuneros.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'The rebels tore their cedulas (tax certificates) as a symbol of their rebellion.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'This event took place in August, just days after the discovery of the Katipunan by Spanish authorities.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion5($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'VERY RARE',
        'question' => 'When did Ferdinand Magellan arrive in the Philippines?',
        'correct_answer' => 'b',
        'reveal_text' => 'You discovered a VERY RARE collectible: "Magellan\'s Arrival Map"! ✨✨

Ferdinand Magellan, a Portuguese explorer sailing for Spain, arrived in the Philippines on March 16, 1521. His fleet anchored off the island of Homonhon in Eastern Samar, making the first recorded contact between Europeans and Filipinos. This historic arrival marked the beginning of Spanish influence in the archipelago. Magellan would later be killed in the Battle of Mactan on April 27, 1521, but his expedition continued and completed the first circumnavigation of the globe.',
        'streak_bonus' => 500,
        'row' => 3,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'April 27, 1521']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'March 16, 1521']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'May 1, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'June 12, 1898']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Magellan\'s Arrival Map',
        'rarity' => 'VERY RARE',
        'image' => '/images/collectibles/magellan-map.png',
        'description' => 'A historical map depicting Magellan\'s route to the Philippines and his arrival at Homonhon.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This event marked the first recorded European contact with the Philippines.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'Magellan\'s fleet anchored off the island of Homonhon in Eastern Samar.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'This event happened approximately six weeks before Magellan was killed in the Battle of Mactan.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion6($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'LEGENDARY',
        'question' => 'What was the date of the Battle of Mactan, where Lapu-Lapu defeated Magellan?',
        'correct_answer' => 'b',
        'reveal_text' => '🌟 LEGENDARY COLLECTIBLE UNLOCKED: "Lapu-Lapu Victory Medallion"! 🌟

On April 27, 1521, the Battle of Mactan took place between the forces of Lapu-Lapu, a native chieftain of Mactan Island, and Ferdinand Magellan\'s Spanish expedition. Lapu-Lapu successfully repelled the Spanish forces and killed Magellan in battle, making it the first recorded resistance of Filipinos against foreign invaders. This victory delayed Spanish colonization by more than 40 years, and Lapu-Lapu is celebrated as the first Filipino hero who successfully resisted foreign conquest.',
        'streak_bonus' => 1000,
        'row' => 3,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'June 12, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'April 27, 1521']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'December 10, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'January 9, 1900']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Lapu-Lapu Victory Medallion',
        'rarity' => 'LEGENDARY',
        'image' => '/images/collectibles/lapu-lapu-medallion.png',
        'description' => 'A golden medallion commemorating Lapu-Lapu\'s victory over Magellan at the Battle of Mactan.',
        'bonus' => 'Unlocks "First Filipino Hero" profile frame'
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This battle resulted in the death of Ferdinand Magellan.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It occurred on Mactan Island, now part of Cebu province.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'The native forces were led by a chieftain named Lapu-Lapu.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion7($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'VERY RARE',
        'question' => 'When was the Treaty of Paris signed, officially ending Spanish rule in the Philippines?',
        'correct_answer' => 'b',
        'reveal_text' => 'You discovered a VERY RARE collectible: "Treaty of Paris Document"! ✨✨

The Treaty of Paris was signed on December 10, 1898, formally ending the Spanish-American War. Under this treaty, Spain ceded the Philippines to the United States for $20 million. Filipino representatives were not invited to the negotiations, and this transfer of sovereignty occurred despite the Philippine Declaration of Independence on June 12, 1898. The treaty marked the end of over 300 years of Spanish colonial rule and the beginning of American colonial period in the Philippines.',
        'streak_bonus' => 500,
        'row' => 4,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'June 12, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'December 10, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'November 30, 1863']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'July 4, 1946']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Treaty of Paris Document',
        'rarity' => 'VERY RARE',
        'image' => '/images/collectibles/paris-treaty.png',
        'description' => 'A replica of the 1898 Treaty of Paris that ended Spanish rule in the Philippines.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This treaty formally ended the Spanish-American War.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'Under this agreement, Spain ceded the Philippines to the United States for $20 million.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'Filipino representatives were not invited to the negotiations for this treaty.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion8($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'NORMAL',
        'question' => 'On what date was the Philippine-American War officially declared?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a NORMAL collectible: "First Shot Shell Casing"! ✨

The Philippine-American War officially began on February 4, 1899, when American soldiers fired upon Filipino troops near Manila after tensions had been building between the two sides. The incident occurred when Private William W. Grayson shot a Filipino soldier who was crossing San Juan Bridge. This conflict erupted just two days after the U.S. Senate ratified the Treaty of Paris, and it would continue until 1902 officially, though resistance continued in some areas until 1913, resulting in hundreds of thousands of Filipino casualties.',
        'streak_bonus' => 100,
        'row' => 4,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'June 12, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'February 4, 1899']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'April 27, 1521']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'September 21, 1972']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'First Shot Shell Casing',
        'rarity' => 'NORMAL',
        'image' => '/images/collectibles/shell-casing.png',
        'description' => 'A replica of the shell casing from the first shot that triggered the Philippine-American War.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This war began just days after the U.S. Senate ratified the Treaty of Paris.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'The first shots were fired by American soldiers at Filipino troops near San Juan Bridge.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'The conflict was triggered when Private William W. Grayson shot a Filipino soldier.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion9($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'COMMON',
        'question' => 'When did Japan invade the Philippines during World War II?',
        'correct_answer' => 'a',
        'reveal_text' => 'You found a COMMON collectible: "Pearl Harbor Newspaper"! ✨

Japan invaded the Philippines on December 8, 1941, just hours after the attack on Pearl Harbor (which was December 7 in Hawaii but December 8 in the Philippines due to the international date line). Japanese forces targeted key military installations, including Clark Air Base and Nichols Field. Despite resistance from American and Filipino forces, the Japanese secured a foothold and would go on to occupy the country until 1945, establishing a puppet government and subjecting the population to harsh conditions during the occupation.',
        'streak_bonus' => 200,
        'row' => 5,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'December 8, 1941']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'August 23, 1896']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'July 4, 1946']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'June 12, 1898']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Pearl Harbor Newspaper',
        'rarity' => 'COMMON',
        'image' => '/images/collectibles/pearl-harbor-news.png',
        'description' => 'A newspaper announcing the Pearl Harbor attack and subsequent invasion of the Philippines.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This event occurred just hours after the attack on Pearl Harbor.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'Japanese forces targeted key military installations like Clark Air Base.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'This invasion led to nearly three years of Japanese occupation.',
        'cost' => 200,
    ]);
}

private function createPetsaTriviaQuestion10($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'RARE',
        'question' => 'When was Martial Law declared by Ferdinand Marcos?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a RARE collectible: "Proclamation 1081 Document"! ✨

On September 21, 1972, President Ferdinand Marcos signed Proclamation No. 1081, placing the entire Philippines under Martial Law. Although signed on September 21, it was announced to the public on September 23. Marcos justified the declaration by citing the threat of communist insurgency. Martial Law suspended civil rights, imposed military authority, and allowed for warrantless arrests. It remained in effect until January 17, 1981, though Marcos retained most powers until his overthrow in 1986. This period is remembered for human rights abuses and corruption.',
        'streak_bonus' => 300,
        'row' => 5,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'December 10, 1898']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'September 21, 1972']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'July 4, 1946']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'June 12, 1898']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Proclamation 1081 Document',
        'rarity' => 'RARE',
        'image' => '/images/collectibles/proclamation-1081.png',
        'description' => 'A copy of Proclamation No. 1081 that placed the Philippines under Martial Law.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This declaration suspended civil rights and imposed military authority throughout the Philippines.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'President Marcos justified this action by citing the threat of communist insurgency.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'Though signed on this date, it was announced to the public two days later.',
        'cost' => 200,
    ]);
}


















private function createDokumentoTriviaQuestion1($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'RARE',
        'question' => 'What was the first constitution of the Philippines?',
        'correct_answer' => 'a',
        'reveal_text' => 'You found a RARE collectible: "Biak-na-Bato Constitution Manuscript"! ✨

The 1897 Biak-na-Bato Constitution was the first Philippine constitution, drafted during the Philippine Revolution. Named after the revolutionary base in San Miguel, Bulacan, it established a Central Revolutionary Government. Written by Isabelo Artacho and Félix Ferrer, and based on the Cuban Constitution, it provided for the creation of a Supreme Council led by President Emilio Aguinaldo. Though short-lived, it represented the first organized attempt at Philippine self-governance.',
        'streak_bonus' => 300,
        'row' => 1,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => '1897 Biak-na-Bato Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => '1935 Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Malolos Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => '1987 Constitution']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Biak-na-Bato Constitution Manuscript',
        'rarity' => 'RARE',
        'image' => '/images/collectibles/biak-na-bato-constitution.png',
        'description' => 'A replica of the manuscript of the first Philippine constitution.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This document was created during the Philippine Revolution against Spain.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It was named after a revolutionary base in San Miguel, Bulacan.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'It was drafted in 1897 and established a Central Revolutionary Government under Emilio Aguinaldo.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion2($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'LEGENDARY',
        'question' => 'Which document declared Philippine independence from Spain?',
        'correct_answer' => 'c',
        'reveal_text' => '🌟 LEGENDARY COLLECTIBLE UNLOCKED: "Philippine Independence Proclamation"! 🌟

The "Acta de la Proclamación de la Independencia del Pueblo Filipino" (Act of Proclamation of Independence of the Filipino People) was the document that formally declared Philippine independence from Spain on June 12, 1898. Drafted by Ambrosio Rianzares Bautista and proclaimed by General Emilio Aguinaldo in Kawit, Cavite, it declared the Philippines free and independent with Aguinaldo as dictator. The document was signed by 98 Filipinos and witnessed by an American artillery officer, making it a powerful symbol of Filipino nationalism and self-determination.',
        'streak_bonus' => 1000,
        'row' => 1,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Malolos Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Treaty of Paris']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Acta de la Proclamación de la Independencia del Pueblo Filipino']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Tydings-McDuffie Act']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Philippine Independence Proclamation',
        'rarity' => 'LEGENDARY',
        'image' => '/images/collectibles/independence-proclamation.png',
        'description' => 'A replica of the historic document declaring Philippine independence from Spain in 1898.',
        'bonus' => 'Unlocks "Independence Hero" profile frame'
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This document was proclaimed on June 12, 1898, in Kawit, Cavite.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It was drafted by Ambrosio Rianzares Bautista and proclaimed by General Emilio Aguinaldo.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'The document has a long Spanish title that translates to "Act of Proclamation of Independence of the Filipino People."',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion3($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'VERY RARE',
        'question' => 'Which document allowed the United States to purchase the Philippines from Spain?',
        'correct_answer' => 'b',
        'reveal_text' => 'You discovered a VERY RARE collectible: "Treaty of Paris Signature Page"! ✨✨

The Treaty of Paris (1898) was signed on December 10, 1898, ending the Spanish-American War. Under Article III of this treaty, Spain ceded the Philippines to the United States for $20 million. The treaty was negotiated without any Filipino representatives present, despite the prior declaration of Philippine independence on June 12, 1898. This document effectively transferred control of the Philippines from Spain to the United States, leading to the Philippine-American War as Filipinos resisted this transfer of sovereignty.',
        'streak_bonus' => 500,
        'row' => 2,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Treaty of Tordesillas']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Treaty of Paris (1898)']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Biak-na-Bato Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Jones Law']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Treaty of Paris Signature Page',
        'rarity' => 'VERY RARE',
        'image' => '/images/collectibles/treaty-paris-signature.png',
        'description' => 'A replica of the signature page of the 1898 Treaty of Paris that transferred the Philippines from Spain to the U.S.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This treaty formally ended the Spanish-American War.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'Under this agreement, Spain received $20 million for the Philippines.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'It was signed in December 1898, without any Filipino representatives present.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion4($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'VERY RARE',
        'question' => 'What was the first constitution written by Filipinos for an independent Philippine Republic?',
        'correct_answer' => 'c',
        'reveal_text' => 'You discovered a VERY RARE collectible: "Malolos Constitution Manuscript"! ✨✨

The Malolos Constitution, officially titled "Constitución Política de la República Filipina," was the first democratic constitution written by Filipinos. Ratified on January 21, 1899, it established the First Philippine Republic in Malolos, Bulacan. Written by Felipe Calderón and other illustrados, it was influenced by the constitutions of France, Belgium, and Latin American countries. It created a democratic republic with separation of powers and a bill of rights. Considered the first republican constitution in Asia, it represented Filipino aspirations for genuine independence and democratic governance.',
        'streak_bonus' => 500,
        'row' => 2,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => '1897 Biak-na-Bato Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => '1935 Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Malolos Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Tydings-McDuffie Act']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Malolos Constitution Manuscript',
        'rarity' => 'VERY RARE',
        'image' => '/images/collectibles/malolos-constitution.png',
        'description' => 'A replica of the manuscript of the first democratic Filipino constitution.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This constitution established the First Philippine Republic.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It was influenced by the constitutions of France, Belgium, and Latin American countries.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'It was named after the town in Bulacan where it was ratified in 1899.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion5($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'NORMAL',
        'question' => 'What document granted the Philippines commonwealth status in 1935?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a NORMAL collectible: "Tydings-McDuffie Act Document"! ✨

The Tydings-McDuffie Act, officially the Philippine Independence Act, was signed on March 24, 1934. It provided for the establishment of the Commonwealth of the Philippines with a ten-year transitional period before full independence. This act allowed Filipinos to draft their own constitution (which became the 1935 Constitution) and elect their own officials, with the U.S. retaining control over foreign policy. It also reduced Filipino immigration to the U.S. to 50 persons annually. The Commonwealth was inaugurated on November 15, 1935, with Manuel L. Quezon as its first president.',
        'streak_bonus' => 100,
        'row' => 3,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Jones Law']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Tydings-McDuffie Act']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Malolos Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Treaty of Paris']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Tydings-McDuffie Act Document',
        'rarity' => 'NORMAL',
        'image' => '/images/collectibles/tydings-mcduffie-act.png',
        'description' => 'A copy of the act that established the Commonwealth of the Philippines.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This document is also known as the Philippine Independence Act.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It provided for a ten-year transitional period before granting full independence to the Philippines.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'It was signed in 1934 and led to the establishment of the Commonwealth in 1935.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion6($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'COMMON',
        'question' => 'Which law served as the first organic act of the Philippines under American rule?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a COMMON collectible: "Philippine Bill of 1902 Pamphlet"! ✨

The Philippine Bill of 1902 (also known as the Cooper Act) was the first organic law for the Philippines enacted by the U.S. Congress during American colonial rule. It established a civil government to replace the military government, provided for the creation of the Philippine Assembly (the first elected legislative body), and outlined basic rights for Filipinos. However, it maintained American sovereignty and gave the U.S.-appointed Governor-General veto power over legislation. The bill also authorized the purchase of friar lands and established a public education system based on the American model.',
        'streak_bonus' => 200,
        'row' => 3,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Jones Law']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Philippine Bill of 1902']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Tydings-McDuffie Act']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Malolos Constitution']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Philippine Bill of 1902 Pamphlet',
        'rarity' => 'COMMON',
        'image' => '/images/collectibles/philippine-bill.png',
        'description' => 'A pamphlet containing the text of the first organic act under American rule.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This law established a civil government to replace the military government in the Philippines.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It provided for the creation of the Philippine Assembly, the first elected legislative body.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'Also known as the Cooper Act, it was passed by the U.S. Congress in the early 1900s.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion7($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'RARE',
        'question' => 'What document replaced the Philippine Bill of 1902 and provided for a more autonomous government?',
        'correct_answer' => 'a',
        'reveal_text' => 'You found a RARE collectible: "Jones Law Original Print"! ✨

The Jones Law of 1916 (also known as the Philippine Autonomy Act) replaced the Philippine Bill of 1902 and granted the Philippines greater autonomy. Authored by Congressman William Atkinson Jones, it established a bicameral legislature with an elected Senate and House of Representatives. The law contained a formal declaration of U.S. intent to recognize Philippine independence "as soon as a stable government can be established." While the U.S. still retained control with a Governor-General, the Jones Law was a significant step toward self-governance and is considered a milestone in the Philippine quest for independence.',
        'streak_bonus' => 300,
        'row' => 4,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Jones Law (1916)']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Tydings-McDuffie Act']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Biak-na-Bato Constitution']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Treaty of Paris']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Jones Law Original Print',
        'rarity' => 'RARE',
        'image' => '/images/collectibles/jones-law-print.png',
        'description' => 'A reproduction of the original print of the 1916 Philippine Autonomy Act.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This law is also known as the Philippine Autonomy Act.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It established a bicameral legislature with an elected Senate and House of Representatives.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'It was authored by Congressman William Atkinson Jones and passed in 1916.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion8($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'NORMAL',
        'question' => 'What document outlined the basic rights and responsibilities of the Katipunan members?',
        'correct_answer' => 'c',
        'reveal_text' => 'You found a NORMAL collectible: "Kartilya ng Katipunan Scroll"! ✨

The Kartilya ng Katipunan (Primer of the Katipunan) was a document that outlined the basic principles, rights, and responsibilities of members of the Katipunan, the revolutionary society founded by Andres Bonifacio in 1892. Written primarily by Emilio Jacinto, Bonifacio\'s trusted adviser, the Kartilya contained moral and civic guidelines promoting patriotism, equality, and dignity. It emphasized personal improvement, honorable conduct, and dedication to the cause of freedom. The document served as both an ideological foundation and a practical code of conduct for the revolutionary movement that sought Philippine independence from Spain.',
        'streak_bonus' => 100,
        'row' => 4,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Pact of Biak-na-Bato']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Acta de Tejeros']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Kartilya ng Katipunan']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'La Liga Filipina Manifesto']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Kartilya ng Katipunan Scroll',
        'rarity' => 'NORMAL',
        'image' => '/images/collectibles/kartilya-scroll.png',
        'description' => 'A scroll containing the principles and code of conduct for Katipunan members.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This document was associated with the revolutionary society founded by Andres Bonifacio.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It was written primarily by Emilio Jacinto, known as the "Brains of the Katipunan."',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'The word "Kartilya" means "primer" or "guide" in English.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion9($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'COMMON',
        'question' => 'What document was the official newspaper of the Propaganda Movement?',
        'correct_answer' => 'a',
        'reveal_text' => 'You found a COMMON collectible: "La Solidaridad Newspaper"! ✨

La Solidaridad was the official newspaper of the Filipino Propaganda Movement, published in Barcelona and later in Madrid from 1889 to 1895. Founded by Graciano López Jaena and later edited by Marcelo H. del Pilar, it served as a platform for Filipino ilustrados to advocate for reforms in the Spanish colonial administration of the Philippines. Contributors included José Rizal, Mariano Ponce, and Antonio Luna, who wrote articles exposing abuses by Spanish authorities and calling for equal rights, representation in the Spanish Cortes, and assimilation of the Philippines as a province of Spain rather than a colony.',
        'streak_bonus' => 200,
        'row' => 5,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'La Solidaridad']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Kalayaan']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Kartilya ng Katipunan']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'True Decalogue']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'La Solidaridad Newspaper',
        'rarity' => 'COMMON',
        'image' => '/images/collectibles/la-solidaridad.png',
        'description' => 'A copy of the newspaper that served as the voice of the Filipino Propaganda Movement.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This publication was founded by Graciano López Jaena in 1889.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It was published in Barcelona and later in Madrid from 1889 to 1895.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'José Rizal, Marcelo H. del Pilar, and Antonio Luna were among its contributors.',
        'cost' => 200,
    ]);
}

private function createDokumentoTriviaQuestion10($categoryId): void
{
    // Create question
    $question = trivia_questions::create([
        'category_id' => $categoryId,
        'rarity' => 'RARE',
        'question' => 'What document, signed in 1897, temporarily ended the revolution in exchange for financial compensation?',
        'correct_answer' => 'b',
        'reveal_text' => 'You found a RARE collectible: "Pact of Biak-na-Bato Seal"! ✨

The Pact of Biak-na-Bato, signed on December 14, 1897, was an agreement between Spanish Governor-General Fernando Primo de Rivera and revolutionary leader Emilio Aguinaldo that temporarily ended the Philippine Revolution. Under this agreement, Aguinaldo and other revolutionary leaders agreed to exile in Hong Kong in exchange for 800,000 pesos, amnesty for revolutionaries, and promises of reforms. However, Spain failed to fulfill many of its promises, and when the Spanish-American War broke out, Aguinaldo returned to resume the revolution. The pact represents an important diplomatic milestone in the Philippine Revolution, even though it proved to be only a temporary truce.',
        'streak_bonus' => 300,
        'row' => 5,
    ]);

    // Create options
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'a', 'text' => 'Treaty of Paris']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'b', 'text' => 'Pact of Biak-na-Bato']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'c', 'text' => 'Acta de Tejeros']);
    trivia_options::create(['question_id' => $question->id, 'option_id' => 'd', 'text' => 'Malolos Constitution']);

    // Create collectible
    collectibles::create([
        'question_id' => $question->id,
        'name' => 'Pact of Biak-na-Bato Seal',
        'rarity' => 'RARE',
        'image' => '/images/collectibles/biak-na-bato-seal.png',
        'description' => 'A seal representing the historic agreement that temporarily ended the Philippine Revolution.',
        'bonus' => null,
    ]);

    // Create clues
    clues::create([
        'question_id' => $question->id,
        'level' => 1,
        'text' => 'This agreement was signed in December 1897 between Spanish authorities and Filipino revolutionaries.',
        'cost' => 0,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 2,
        'text' => 'It included financial compensation of 800,000 pesos and amnesty for revolutionaries.',
        'cost' => 100,
    ]);
    clues::create([
        'question_id' => $question->id,
        'level' => 3,
        'text' => 'Under this agreement, Emilio Aguinaldo and other revolutionary leaders agreed to exile in Hong Kong.',
        'cost' => 200,
    ]);
}


}