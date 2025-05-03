<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_game_powerups extends Model
{
    use HasFactory;

    protected $fillable = ['user_game_session_id', 'power_up_id', 'is_used'];

    protected $casts = [
        'is_used' => 'boolean',
    ];

    public function session()
    {
        return $this->belongsTo(user_game_sessions::class, 'user_game_session_id');
    }
    
    public function powerUp()
    {
        return $this->belongsTo(power_ups::class, 'power_up_id');
    }
}