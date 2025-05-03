<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'maintenance_mode',
    ];
}

use Illuminate\Support\Facades\Route;
use App\Models\Setting;

Route::post('/admin/update-maintenance', function (Request $request) {
    $setting = Setting::firstOrCreate([]);
    $setting->maintenance_mode = $request->input('maintenance') ? 1 : 0;
    $setting->save();

    return response()->json(['success' => true]);


