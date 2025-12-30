<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class IsSuperAdmin
{
    /**
     * Check if user is super admin
     * Super admin dapat diidentifikasi dengan:
     * 1. Database field role = 'super_admin', atau
     * 2. Email diset sebagai SUPER_ADMIN_EMAIL di env, atau
     * 3. Query parameter superadmin_key yang valid
     */
    public function handle($request, Closure $next)
    {
        // Check if accessed via secret key
        $superAdminSecret = env('SUPER_ADMIN_SECRET', 'superadmin2024secure');
        $providedKey = $request->query('superadmin_key') ?? $request->header('X-Super-Admin-Key');

        if ($providedKey === $superAdminSecret) {
            // Valid secret key - bypass auth check
            return $next($request);
        }

        // Otherwise check normal authentication
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check if user is super admin
        $superAdminEmail = env('SUPER_ADMIN_EMAIL', 'superadmin@example.com');

        // Option 1: Check by email
        if ($user->email === $superAdminEmail) {
            return $next($request);
        }

        // Option 2: Check by role (if we add role field)
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized - Super admin access required'], 403);
    }
}
