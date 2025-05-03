<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     */
    public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user() ? array_merge(
                $request->user()->only(
                    'id', 'name', 'email', 'email_verified_at', 'created_at'
                ),
                [
                    'bio' => $request->user()->bio ?? '',
                    'description' => $request->user()->description ?? '',
                    'profile_photo_url' => $request->user()->profile_photo
                        ? asset('storage/' . $request->user()->profile_photo)
                        : asset('default-profile.png'),

                    'cover_photo_url' => $request->user()->cover_photo
                        ? asset('storage/' . $request->user()->cover_photo)
                        : asset('default-cover.jpg'),
                ]
            ) : null,
        ],
        'flash' => [
            'message' => fn () => $request->session()->get('message'),
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
        'csrf_token' => csrf_token(),
    ]);
}

}
