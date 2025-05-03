<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class trivia_categories extends Model
{
    use HasFactory;

    protected $table = 'trivia_categories';
    
    protected $fillable = [
        'name',
        'tag_name',
        'description',
        'is_active'
    ];

    /**
     * Get the trivia questions that belong to this category.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(TriviaQuestion::class, 'category_id');
    }

    /**
     * Get the display name (combination of name and tag name).
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->tag_name) {
            return "{$this->name} ({$this->tag_name})";
        }

        return $this->name;
    }
}
