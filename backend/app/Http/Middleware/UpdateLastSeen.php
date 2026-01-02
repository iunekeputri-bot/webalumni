<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class UpdateLastSeen
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            // Update last_seen_at if it's been more than 1 minute since last update
            // to avoid too many DB writes
            if (!$user->last_seen_at || $user->last_seen_at->diffInMinutes(now()) > 0) {
                $user->update(['last_seen_at' => now()]);
            }
        }

        return $next($request);
    }
}
