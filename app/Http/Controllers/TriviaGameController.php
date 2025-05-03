<?php

namespace App\Http\Controllers;

use App\Models\user_game_sessions;
use App\Models\trivia_questions;
use App\Models\trivia_options;
use App\Models\power_ups;
use App\Models\user_collectibles;
use App\Models\user_session_answers;
use App\Models\leaderboards;
use App\Models\clues;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TriviaGameController extends Controller
{
    public function index()
    {
        // Get or create active game session for the user
        $user = Auth::user();
        $gameSession = $this->getOrCreateGameSession($user->id);

        // Get trivia data for the current session
        $gameData = $this->prepareGameData($gameSession);

        return Inertia::render('play', [
            'gameData' => $gameData,
            'user' => $user
        ]);
    }

    private function getOrCreateGameSession($userId)
    {
        // Check for active session
        $gameSession = user_game_sessions::where('user_id', $userId)
            ->where('is_active', true)
            ->first();

        if (!$gameSession) {
            // Create new game session
            $gameSession = user_game_sessions::create([
                'user_id' => $userId,
                'level' => 1,
                'current_row' => 1,
                'score' => 0,
                'streak' => 0,
                'hearts' => 3,
                'game_mode' => 'normal',
                'is_active' => true
            ]);

            // Assign initial powerups to the user
            $this->assignInitialPowerUps($gameSession);
        }

        return $gameSession;
    }

    private function assignInitialPowerUps($gameSession)
    {
        // Get basic powerups
        $powerUps = power_ups::whereIn('slug', ['fifty-fifty', 'shield'])->get();

        foreach ($powerUps as $powerUp) {
            $gameSession->powerUps()->attach($powerUp->id, ['is_used' => false]);
        }
    }

    private function prepareGameData($gameSession)
    {
        // Get questions for current level and organize by row
        $triviaQuestions = trivia_questions::where('row', '<=', 3)
            ->with(['options', 'collectible', 'clues', 'category'])
            ->get();

        // Get answered questions for this session
        $answeredQuestions = user_session_answers::where('user_game_session_id', $gameSession->id)
            ->pluck('question_id')
            ->toArray();

        // Format questions
        $triviaData = [];
        foreach ($triviaQuestions as $question) {
            $options = [];
            foreach ($question->options as $option) {
                $options[] = [
                    'id' => $option->option_id,
                    'text' => $option->text
                ];
            }

            $triviaData[] = [
                'id' => $question->id,
                'question' => $question->question,
                'options' => $options,
                'correctAnswer' => $question->correct_answer,
                'revealText' => $question->reveal_text,
                'streakBonus' => $question->streak_bonus,
                'collectible' => $question->collectible ? [
                    'name' => $question->collectible->name,
                    'rarity' => $question->collectible->rarity,
                    'image' => $question->collectible->image,
                    'bonus' => $question->collectible->bonus,
                    'description' => $question->collectible->description,
                ] : null, // protect para di mag error
                'row' => $question->row,
                'completed' => in_array($question->id, $answeredQuestions),
            ];
        }

        // Get clues data
        $cluesData = [];
        $cluesByQuestion = clues::whereIn('question_id', $triviaQuestions->pluck('id'))
            ->orderBy('level')
            ->get()
            ->groupBy('question_id');

        foreach ($cluesByQuestion as $questionId => $questionClues) {
            $cluesList = [];
            foreach ($questionClues as $clue) {
                $cluesList[] = [
                    'level' => $clue->level,
                    'text' => $clue->text,
                    'cost' => $clue->cost
                ];
            }

            $question = $triviaQuestions->firstWhere('id', $questionId);
            $cluesData[] = [
                'question_id' => $questionId,
                'category' => $question->category->name,
                'clues' => $cluesList
            ];
        }

        // Get user's available powerups
        $powerUps = $gameSession->powerUps()
            ->wherePivot('is_used', false)
            ->get()
            ->pluck('slug')
            ->toArray();

        // Get collected items
        $collectedItems = user_collectibles::where('user_id', $gameSession->user_id)
            ->with('collectible')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->collectible->name,
                    'rarity' => $item->collectible->rarity,
                    'image' => $item->collectible->image,
                    'bonus' => $item->collectible->bonus,
                    'description' => $item->collectible->description
                ];
            })
            ->toArray();

        // Calculate row status
        $rowStatus = [
            'row1Completed' => $this->isRowCompleted($triviaData, 1, $answeredQuestions),
            'row2Completed' => $this->isRowCompleted($triviaData, 2, $answeredQuestions),
            'row3Completed' => $this->isRowCompleted($triviaData, 3, $answeredQuestions)
        ];

        // Get leaderboard data
        $leaderboard = leaderboards::where('game_mode', $gameSession->game_mode)
            ->orderBy('score', 'desc')
            ->limit(10)
            ->with('user')
            ->get()
            ->map(function ($entry) {
                return [
                    'user' => $entry->user->name,
                    'score' => $entry->score,
                    'level' => $entry->level_reached,
                    'streak' => $entry->max_streak,
                    'collectibles' => $entry->collectibles_earned,
                    'date' => $entry->created_at->format('M d, Y')
                ];
            })
            ->toArray();

        // Prepare game data
        return [
            'session' => [
                'id' => $gameSession->id,
                'level' => $gameSession->level,
                'currentRow' => $gameSession->current_row,
                'score' => $gameSession->score,
                'streak' => $gameSession->streak,
                'hearts' => $gameSession->hearts,
                'gameMode' => $gameSession->game_mode
            ],
            'triviaData' => $triviaData,
            'cluesData' => $cluesData,
            'powerUps' => $powerUps,
            'collectedItems' => $collectedItems,
            'rowStatus' => $rowStatus,
            'completedQuestions' => $answeredQuestions,
            'leaderboard' => $leaderboard
        ];
    }

    private function isRowCompleted($triviaData, $row, $answeredQuestions)
    {
        // Get questions for this row
        $rowQuestions = array_filter($triviaData, function($q) use ($row) {
            return $q['row'] == $row;
        });

        // Check if all questions are answered
        foreach ($rowQuestions as $question) {
            if (!in_array($question['id'], $answeredQuestions)) {
                return false;
            }
        }

        return count($rowQuestions) > 0;
    }
}
