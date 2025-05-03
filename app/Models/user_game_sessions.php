<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class user_game_sessions extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'level', 'current_row', 'score', 'streak',
        'hearts', 'game_mode', 'is_active', 'completed_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(user_session_answers::class, 'user_game_session_id');
    }

    public function collectibles()
    {
        return $this->hasMany(user_collectibles::class, 'user_game_session_id');
    }

    public function powerUps()
    {
        return $this->belongsToMany(power_ups::class, 'user_game_powerups', 
            'user_game_session_id', 'power_up_id')  // Note the singular "session"
            ->withPivot('is_used')
            ->withTimestamps();
    }
}

