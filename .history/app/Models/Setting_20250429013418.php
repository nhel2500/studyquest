<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Route;
use App\Models\Setting;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'maintenance_mode',
    ];
}
