<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class user_session_answers extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_game_session_id', 'question_id', 'selected_answer',
        'is_correct', 'points_earned'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function gameSession(): BelongsTo
    {
        return $this->belongsTo(user_game_sessions::class, 'user_game_session_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(trivia_questions::class);
    }
}