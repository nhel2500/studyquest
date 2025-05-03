<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class trivia_questions extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'rarity', 'question', 'correct_answer',
        'reveal_text', 'streak_bonus', 'row'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(trivia_categories::class, 'category_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(trivia_options::class, 'question_id');
    }

    public function collectible(): HasOne
    {
        return $this->hasOne(collectibles::class, 'question_id');
    }

    public function clues(): HasMany
    {
        return $this->hasMany(clues::class, 'question_id');
    }
}
