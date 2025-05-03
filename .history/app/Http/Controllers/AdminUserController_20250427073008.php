<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\LeaderboardController;
use Illuminate\Support\Arr;
use App\Models\Setting;


class AdminUserController extends Controller
{
    public function index()
    {
        // Use the LeaderboardController's fetchLeaderboard method
        $leaderboardController = new LeaderboardController();
        $response = $leaderboardController->fetchLeaderboard();

        // Extract the data (array of users with scores)
        $data = $response->getData(true); // return as array
        $users = $data; // the whole array is already the leaderboard
         // safely extract top-level array

        return Inertia::render('admin-panel/admin', [
            'users' => $users,
        ]);
    }

    public function toggleMaintenance()
{
    $setting = \App\Models\Setting::first(); // kunin yung settings
    if (!$setting) {
        $setting = new \App\Models\Setting(); // create kung wala
    }
    $setting->maintenance_mode = !$setting->maintenance_mode; // toggle maintenance mode
    $setting->save();

    return response()->json([
        'message' => 'Maintenance mode toggled.',
        'maintenance_mode' => $setting->maintenance_mode,
    ]);
}

}
