<?php

namespace App\Http\Controllers;

use App\Models\leaderboards;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class LeaderboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get normal mode leaderboardx
        $normalLeaderboard = $this->getLeaderboardData('normal');

        // Get sudden death mode leaderboard
        $suddenDeathLeaderboard = $this->getLeaderboardData('suddenDeath');

        // Get user's rank in normal mode
        $userRankNormal = $this->getUserRank($user->id, 'normal');

        // Get user's rank in sudden death mode
        $userRankSuddenDeath = $this->getUserRank($user->id, 'suddenDeath');

        $allUsers = User::select('name', 'id')
        ->orderBy('name')
        ->get()
        ->map(function ($user) {
            return [
                'user' => $user->name,
                'score' => 0,
                'level' => 1,
                'streak' => 0,
                'collectibles' => 0,
                'date' => null,
            ];
        });

        return Inertia::render('Leaderboard', [
            'normalLeaderboard' => $normalLeaderboard,
            'suddenDeathLeaderboard' => $suddenDeathLeaderboard,
            'userRankNormal' => $userRankNormal,
            'userRankSuddenDeath' => $userRankSuddenDeath,
            'activeMode' => 'normal',
            'allUsers' => $allUsers, // ➡️ ADD THIS
            'authUser' => auth()->user()->name, // ➡️ ADD THIS TOO (para mahanap auth user sa frontend)
        ]);
    }

    private function getLeaderboardData($gameMode)
    {
        return leaderboards::where('game_mode', $gameMode)
            ->orderBy('score', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($entry) {
                $user = User::find($entry->user_id);
                return [
                    'user' => $user ? $user->name : 'Unknown Player',
                    'score' => $entry->score,
                    'level' => $entry->level_reached,
                    'streak' => $entry->max_streak,
                    'collectibles' => $entry->collectibles_earned,
                    'date' => $entry->created_at->format('M d, Y')
                ];
            });
    }

    private function getUserRank($userId, $gameMode)
    {
        $userScore = leaderboards::where('user_id', $userId)
            ->where('game_mode', $gameMode)
            ->orderBy('score', 'desc')
            ->first();

        if (!$userScore) {
            return [
                'rank' => null,
                'score' => null,
                'total' => leaderboards::where('game_mode', $gameMode)->count()
            ];
        }

        $rank = leaderboards::where('game_mode', $gameMode)
            ->where('score', '>', $userScore->score)
            ->count() + 1;

        return [
            'rank' => $rank,
            'score' => $userScore->score,
            'total' => leaderboards::where('game_mode', $gameMode)->count()
        ];
    }

    public function fetchLeaderboard()
    {
        $topScores = leaderboards::with('user')
            ->select(
                'user_id',
                DB::raw('MAX(score) as score'),
                DB::raw('MAX(level_reached) as level'),
                DB::raw('MAX(max_streak) as streak'),
                DB::raw('MAX(collectibles_earned) as collectibles'),
                DB::raw('MAX(created_at) as latest_play')
            )
            ->groupBy('user_id')
            ->orderByDesc('score')
            ->get()
            ->map(function ($entry) {
                return [
                    'user' => $entry->user?->name ?? 'Unknown Player',
                    'email' => $entry->user?->email ?? 'unknown@example.com',
                    'id' => $entry->user?->id ?? 0,
                    'score' => $entry->score,
                    'level' => $entry->level,
                    'streak' => $entry->streak,
                    'collectibles' => $entry->collectibles,
                    'date' => \Carbon\Carbon::parse($entry->latest_play)->format('M d, Y'),
                ];
            });

        return response()->json($topScores);
    }
}
