<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.

     * @return array<string, ValidationRule|array<mixed>|string>
     */
        public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    return [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'bio' => 'nullable|string|max:1000',
        'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'cover_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ];
}
public function all($keys = null)
{
    $data = parent::all($keys);

    // Add uploaded files manually to the request data
    $data['profile_photo'] = $this->file('profile_photo');
    $data['cover_photo'] = $this->file('cover_photo');

    return $data;
}





}
