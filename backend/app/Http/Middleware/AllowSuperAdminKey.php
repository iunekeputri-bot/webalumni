<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AllowSuperAdminKey
{
    /**
     * Middleware untuk allow super admin access via secret key tanpa token auth
     * Jika secret key valid, allow access
     * Jika tidak, check normal token authentication
     */
    public function handle($request, Closure $next)
    {
        $superAdminSecret = env('SUPER_ADMIN_SECRET', 'superadmin2024secure');
        $providedKey = $request->query('superadmin_key') ?? $request->header('X-Super-Admin-Key');

        // Check 1: Jika secret key valid, allow access langsung
        if ($providedKey === $superAdminSecret) {
            return $next($request);
        }

        // Check 2: Jika tidak ada secret key, check token authentication (Sanctum)
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check 3: Verify user is super admin
        $superAdminEmail = env('SUPER_ADMIN_EMAIL', 'superadmin@example.com');

        if ($user->email === $superAdminEmail || $user->role === 'super_admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized - Super admin access required'], 403);
    }
}


