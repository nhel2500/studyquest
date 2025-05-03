<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'profile_photo',
        'cover_photo',
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }








    public function gameSessions(): HasMany
    {
        return $this->hasMany(UserGameSession::class);
    }

    public function collectibles(): BelongsToMany
    {
        return $this->belongsToMany(Collectible::class, 'user_collectibles')
            ->withPivot('user_game_session_id')
            ->withTimestamps();
    }

    public function leaderboardEntries(): HasMany
    {
        return $this->hasMany(Leaderboard::class);
    }


}
