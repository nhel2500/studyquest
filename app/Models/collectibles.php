<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class collectibles extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id', 'name', 'rarity', 'image', 'bonus', 'description'
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(trivia_questions::class, 'question_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_collectibles')
            ->withPivot('user_game_session_id')
            ->withTimestamps();
    }
}