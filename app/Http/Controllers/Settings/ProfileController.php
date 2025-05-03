<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
{


    $user = $request->user();

    // Fill in validated fields: name, email, bio (assuming bio is in rules)
    $user->fill($request->only('name', 'email', 'bio'));

    // If email changed, reset verification
    if ($user->isDirty('email')) {
        $user->email_verified_at = null;
    }

    // Handle profile photo upload
    if ($request->hasFile('profile_photo')) {
        $user->profile_photo = $request->file('profile_photo')->store('profile_photos', 'public');
    }

    // Handle cover photo upload
    if ($request->hasFile('cover_photo')) {
        $user->cover_photo = $request->file('cover_photo')->store('cover_photos', 'public');
    }
    //dd($request->validated());


    // Save updated user data
    $user->save();

    return to_route('profile.edit')->with('success', 'Profile updated successfully!');
}



    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
