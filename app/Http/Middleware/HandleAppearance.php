<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log that we're entering the middleware
        Log::info('Entering HandleAppearance middleware');

        try {
            // Check if appearance cookie exists
            if ($request->hasCookie('appearance')) {
                $appearance = $request->cookie('appearance');
                // Log the appearance value
                Log::info('Appearance cookie value: ' . $appearance);
                
                // Share with Inertia - wrap in try/catch to debug errors
                try {
                    inertia()->share('appearance', $appearance);
                    Log::info('Successfully shared appearance with Inertia');
                } catch (\Exception $e) {
                    Log::error('Error sharing with Inertia: ' . $e->getMessage());
                    // Continue without failing
                }
            } else {
                Log::info('No appearance cookie found');
            }
            
            // Proceed with the request
            return $next($request);
        } catch (\Exception $e) {
            // Log any exceptions
            Log::error('Exception in HandleAppearance middleware: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // Continue with the request anyway to prevent middleware from breaking the site
            return $next($request);
        }
    }
}