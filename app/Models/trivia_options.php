<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class trivia_options extends Model
{
    use HasFactory;

    protected $fillable = ['question_id', 'option_id', 'text'];

    public function question(): BelongsTo
    {
        return $this->belongsTo(trivia_questions::class);
    }
}

