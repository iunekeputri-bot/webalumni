<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // Do not attempt to generate a redirect to a web `login` route here.
        // Returning null lets the framework handle unauthenticated requests
        // (JSON requests will receive 401; non-JSON can still be redirected
        // by other parts of the app if a login route exists).
        return null;
    }
}
