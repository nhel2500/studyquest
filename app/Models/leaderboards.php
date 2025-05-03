<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class leaderboards extends Model
{
    use HasFactory;

protected $fillable = [
    'user_id', 'score', 'level_reached', 'max_streak',
    'collectibles_earned', 'game_mode'
];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
