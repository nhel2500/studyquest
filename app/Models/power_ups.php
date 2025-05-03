<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class power_ups extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'name', 'icon', 'description'];

    public function userSessions()
    {
        return $this->belongsToMany(user_game_sessions::class, 'user_game_powerups', 
            'power_up_id', 'user_game_session_id')  // Note the singular "session"
            ->withPivot('is_used')
            ->withTimestamps();
    }
}