<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class user_collectibles extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'collectible_id', 'user_game_session_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collectible(): BelongsTo
    {
        return $this->belongsTo(collectibles::class);
    }

    public function gameSession(): BelongsTo
    {
        return $this->belongsTo(user_game_sessions::class, 'user_game_session_id');
    }
}
