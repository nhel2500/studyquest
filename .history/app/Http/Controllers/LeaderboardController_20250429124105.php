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

    $normalLeaderboard = $this->getLeaderboardData('normal');
    $suddenDeathLeaderboard = $this->getLeaderboardData('suddenDeath');
    $userRankNormal = $this->getUserRank($user->id, 'normal');
    $userRankSuddenDeath = $this->getUserRank($user->id, 'suddenDeath');

    $allUsers = User::select('name', 'id', 'score', 'level', 'streak', 'collectibles', 'updated_at')
        ->orderBy('name')
        ->get()
        ->map(function ($user) {
            return [
                'user' => $user->name,
                'score' => $user->score,
                'level' => $user->level,
                'streak' => $user->streak,
                'collectibles' => $user->collectibles,
                'date' => $user->updated_at ? $user->updated_at->format('M d, Y') : null,
            ];
        });

    return Inertia::render('leaderboard', [
        'normalLeaderboard' => $normalLeaderboard,
        'suddenDeathLeaderboard' => $suddenDeathLeaderboard,
        'userRankNormal' => $userRankNormal,
        'userRankSuddenDeath' => $userRankSuddenDeath,
        'activeMode' => 'normal',
        'allUsers' => $allUsers,
        'authUser' => $user->name,
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
        $users = User::select('name as user', 'email', 'id', 'score', 'updated_at')
            ->orderByDesc('score')
            ->get()
            ->map(function ($user) {
                return [
                    'user' => $user->user,
                    'email' => $user->email,
                    'id' => $user->id,
                    'score' => $user->score,
                    'level' => 1, // Default or remove if you want
                    'streak' => 0, // Default or remove if you want
                    'collectibles' => 0, // Default or remove if you want
                    'date' => $user->updated_at ? $user->updated_at->format('M d, Y') : 'N/A',
                ];
            });

        return response()->json($users);
    }

}
