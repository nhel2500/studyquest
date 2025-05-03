<?php

namespace App\Http\Controllers;

use App\Models\user_game_sessions;
use App\Models\trivia_questions;
use App\Models\clues;
use App\Models\user_collectibles;
use App\Models\user_session_answers;
use App\Models\power_ups;
use App\Models\leaderboards; // Added this import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TriviaApiController extends Controller
{
    public function submitAnswer(Request $request)
    {
        try {
            $user = Auth::user();
            $questionId = $request->input('questionId');
            $selectedAnswer = $request->input('selectedAnswer');
            $activePowerUp = $request->input('activePowerUp');
            
            // Get the current game session
            $gameSession = user_game_sessions::where('user_id', $user->id)
                ->where('is_active', true)
                ->first();
                
            if (!$gameSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active game session found'
                ], 400);
            }
            
            // Get the question
            $question = trivia_questions::with(['options', 'collectible'])->find($questionId);
            if (!$question) {
                return response()->json([
                    'success' => false,
                    'message' => 'Question not found'
                ], 404);
            }
            
            // Check if correct
            $isCorrect = $selectedAnswer === $question->correct_answer;
            
            // Calculate points
            $pointsEarned = 0;
            $collectibleAwarded = null;
            
            if ($isCorrect) {
                // Base points
                $pointsEarned = 10;
                
                // Add streak bonus
                $newStreak = $gameSession->streak + 1;
                $pointsEarned += $question->streak_bonus * ($newStreak / 10);
                
                // Double points powerup
                if ($activePowerUp === 'double-points') {
                    $pointsEarned *= 2;
                    
                    // Mark powerup as used
                    $this->usePowerUp($gameSession, 'double-points');
                }
                
                // Update game session
                $gameSession->update([
                    'score' => $gameSession->score + $pointsEarned,
                    'streak' => $newStreak
                ]);
                
                // Check if should award collectible (for example, every 3rd correct answer)
                if ($newStreak % 3 === 0 || $question->rarity === 'RARE' || $question->rarity === 'VERY RARE' || $question->rarity === 'LEGENDARY') {
                    // Award collectible
                    user_collectibles::create([
                        'user_id' => $user->id,
                        'collectible_id' => $question->collectible->id,
                        'user_game_session_id' => $gameSession->id
                    ]);
                    
                    $collectibleAwarded = [
                        'name' => $question->collectible->name,
                        'rarity' => $question->collectible->rarity,
                        'image' => $question->collectible->image,
                        'bonus' => $question->collectible->bonus,
                        'description' => $question->collectible->description
                    ];
                }
            } else {
                // Wrong answer - lose a heart unless shield is active
                if ($activePowerUp === 'shield') {
                    // Mark shield as used
                    $this->usePowerUp($gameSession, 'shield');
                } else {
                    $gameSession->update([
                        'hearts' => $gameSession->hearts - 1,
                        'streak' => 0
                    ]);
                }
            }
            
            // Record the answer
            user_session_answers::create([
                'user_game_session_id' => $gameSession->id,
                'question_id' => $questionId,
                'selected_answer' => $selectedAnswer,
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned
            ]);
            
            // Determine game state
            $gameState = 'revealed';
            if ($gameSession->hearts <= 0) {
                $gameState = 'gameOver';
                $this->handleGameOver($gameSession);
            }
            
            // Get updated session
            $updatedSession = [
                'id' => $gameSession->id,
                'level' => $gameSession->level,
                'currentRow' => $gameSession->current_row,
                'score' => $gameSession->score,
                'streak' => $gameSession->streak,
                'hearts' => $gameSession->hearts,
                'gameMode' => $gameSession->game_mode
            ];
            
            return response()->json([
                'success' => true,
                'isCorrect' => $isCorrect,
                'pointsEarned' => $pointsEarned,
                'collectibleAwarded' => $collectibleAwarded,
                'gameState' => $gameState,
                'session' => $updatedSession
            ]);
        } catch (\Exception $e) {
            Log::error('Error in submitAnswer', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your answer',
                'debug' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getClue(Request $request)
    {
        try {
            $user = Auth::user();
            $questionId = $request->input('questionId');
            $clueLevel = $request->input('clueLevel');
            
            // Get the current game session
            $gameSession = user_game_sessions::where('user_id', $user->id)
                ->where('is_active', true)
                ->first();
                
            if (!$gameSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active game session found'
                ], 400);
            }
            
            // Get the clue
            $clue = clues::where('question_id', $questionId)
                ->where('level', $clueLevel)
                ->first();
                
            if (!$clue) {
                return response()->json([
                    'success' => false,
                    'message' => 'Clue not found'
                ], 404);
            }
            
            // Check if user has enough points
            if ($gameSession->score < $clue->cost) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough points to purchase this clue'
                ], 400);
            }
            
            // Deduct cost from score
            $updatedScore = $gameSession->score - $clue->cost;
            $gameSession->update(['score' => $updatedScore]);
            
            return response()->json([
                'success' => true,
                'clue' => [
                    'level' => $clue->level,
                    'text' => $clue->text,
                    'cost' => $clue->cost
                ],
                'updatedScore' => $updatedScore
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getClue', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while getting the clue',
                'debug' => $e->getMessage()
            ], 500);
        }
    }
    
    public function addPowerUp(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Get the current game session
            $gameSession = user_game_sessions::where('user_id', $user->id)
                ->where('is_active', true)
                ->first();
                
            if (!$gameSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active game session found'
                ], 400);
            }
            
            // Get a random powerup
            $powerUps = ['fifty-fifty', 'shield', 'double-points', 'heal', 'shuffle'];
            $randomPowerUp = $powerUps[array_rand($powerUps)];
            
            // Get the powerup model
            $powerUp = power_ups::where('slug', $randomPowerUp)->first();
            
            if (!$powerUp) {
                return response()->json([
                    'success' => false,
                    'message' => 'Power-up not found'
                ], 404);
            }
            
            // Add powerup to user
            $gameSession->powerUps()->attach($powerUp->id, ['is_used' => false]);
            
            return response()->json([
                'success' => true,
                'powerUp' => $randomPowerUp
            ]);
        } catch (\Exception $e) {
            Log::error('Error in addPowerUp', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while adding the power-up',
                'debug' => $e->getMessage()
            ], 500);
        }
    }
    
    // Fixed method - This is the one that should be called from your routes
    public function restart(Request $request)
    {
        try {
            $user = Auth::user();
            $gameMode = $request->input('gameMode', 'normal');
            
            Log::info('Restarting game', [
                'user_id' => $user->id,
                'game_mode' => $gameMode
            ]);
            
            // End current session if exists
            user_game_sessions::where('user_id', $user->id)
                ->where('is_active', true)
                ->update(['is_active' => false, 'completed_at' => now()]);
                
            // Create new session
            $gameSession = user_game_sessions::create([
                'user_id' => $user->id,
                'level' => 1,
                'current_row' => 1,
                'score' => 0,
                'streak' => 0,
                'hearts' => $gameMode === 'normal' ? 3 : 1,
                'game_mode' => $gameMode,
                'is_active' => true
            ]);
            
            // Assign initial powerups
            $this->assignInitialPowerUps($gameSession);
            
            // Get fresh game data
            $triviaGameController = new TriviaGameController();
            $gameData = $triviaGameController->prepareGameData($gameSession);
            
            return response()->json([
                'success' => true,
                'gameData' => $gameData
            ]);
        } catch (\Exception $e) {
            Log::error('Error in restart', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while restarting the game: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function nextLevel(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Get the current game session
            $gameSession = user_game_sessions::where('user_id', $user->id)
                ->where('is_active', true)
                ->first();
                
            if (!$gameSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active game session found'
                ], 400);
            }
            
            // Increment level
            $gameSession->update([
                'level' => $gameSession->level + 1,
                'current_row' => 1,
                'hearts' => $gameSession->game_mode === 'normal' ? 3 : 1
            ]);
            
            // Clear completed questions for the new level
            user_session_answers::where('user_game_session_id', $gameSession->id)->delete();
            
            // Get fresh game data
            $triviaGameController = new TriviaGameController();
            $gameData = $triviaGameController->prepareGameData($gameSession);
            
            return response()->json([
                'success' => true,
                'gameData' => $gameData
            ]);
        } catch (\Exception $e) {
            Log::error('Error in nextLevel', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while advancing to the next level',
                'debug' => $e->getMessage()
            ], 500);
        }
    }
    
    private function handleGameOver($gameSession)
    {
        try {
            // Mark session as completed
            $gameSession->update([
                'is_active' => false,
                'completed_at' => now()
            ]);
            
            // Record leaderboard entry
            $collectiblesCount = user_collectibles::where('user_game_session_id', $gameSession->id)->count();
            
            Log::info('Creating leaderboard entry', [
                'user_id' => $gameSession->user_id,
                'score' => $gameSession->score,
                'level' => $gameSession->level,
                'game_mode' => $gameSession->game_mode
            ]);
            
            leaderboards::create([
                'user_id' => $gameSession->user_id,
                'score' => $gameSession->score,
                'level_reached' => $gameSession->level,
                'max_streak' => $gameSession->streak,
                'collectibles_earned' => $collectiblesCount,
                'game_mode' => $gameSession->game_mode
            ]);
            
            Log::info('Leaderboard entry created successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create leaderboard entry', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    private function usePowerUp($gameSession, $powerUpSlug)
    {
        try {
            $powerUp = power_ups::where('slug', $powerUpSlug)->first();
            
            if ($powerUp) {
                $pivot = $gameSession->powerUps()
                    ->wherePivot('power_up_id', $powerUp->id)
                    ->wherePivot('is_used', false)
                    ->first();
                
                if ($pivot) {
                    $pivot->pivot->update(['is_used' => true]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error using power-up', [
                'powerUpSlug' => $powerUpSlug,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    private function assignInitialPowerUps($gameSession)
    {
        try {
            // Get basic powerups
            $powerUps = power_ups::whereIn('slug', ['fifty-fifty', 'shield'])->get();
            
            foreach ($powerUps as $powerUp) {
                $gameSession->powerUps()->attach($powerUp->id, ['is_used' => false]);
            }
        } catch (\Exception $e) {
            Log::error('Error assigning initial power-ups', [
                'error' => $e->getMessage()
            ]);
        }
    }
}