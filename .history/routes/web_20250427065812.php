<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TriviaGameController;
use App\Http\Controllers\TriviaApiController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminQuestionController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('leaderboard', function () {
        return Inertia::render('leaderboard');
    })->name('leaderboard');

    Route::get('guide', function () {
        return Inertia::render('guide');
    })->name('guide');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('view-profile', function () {
        return Inertia::render('user/view-profile'); // ✅ fixed
    })->name('view.profile');

    // Replace the simple route with the controller method
    Route::get('leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');
    Route::get('play', [TriviaGameController::class, 'index'])->name('play');

    Route::get('/home-page', function () {
        return Inertia::render('home-page'); // NO 'user/' here since it's in pages/home-page.tsx directly
    })->middleware(['auth', 'verified'])->name('home-page');

});

Route::get('/admin', [AdminUserController::class, 'index']);
Route::get('/admin/fetch-leaderboard', [LeaderboardController::class, 'fetchLeaderboard']);
Route::post('/admin/add-question', [AdminQuestionController::class, 'store'])->name('admin.add-question');
Route::get('/admin/fetch-questions', [AdminQuestionController::class, 'fetchQuestions']);
Route::put('/admin/update-question/{id}', [AdminQuestionController::class, 'update']);

Route::get('/api/check-maintenance', function () {
    $setting = \App\Models\Setting::first();
    return response()->json([
        'maintenance' => $setting ? (bool) $setting->maintenance_mode : false,
    ]);
});



Route::middleware(['auth:sanctum'])->prefix('api')->group(function () {
    Route::post('/trivia/answer', [TriviaApiController::class, 'submitAnswer']);
    Route::post('/trivia/clue', [TriviaApiController::class, 'getClue']);
    Route::post('/trivia/add-powerup', [TriviaApiController::class, 'addPowerUp']);
    Route::post('/trivia/restart', [TriviaApiController::class, 'restart']);
    Route::post('/trivia/next-level', [TriviaApiController::class, 'nextLevel']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
