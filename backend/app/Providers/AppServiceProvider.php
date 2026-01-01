<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register Global Observer for Realtime Updates
        \App\Models\JobPosting::observe(\App\Observers\GlobalRealtimeObserver::class);
        \App\Models\JobApplication::observe(\App\Observers\GlobalRealtimeObserver::class);
        \App\Models\Alumni::observe(\App\Observers\GlobalRealtimeObserver::class);
        \App\Models\Document::observe(\App\Observers\GlobalRealtimeObserver::class);
        \App\Models\Message::observe(\App\Observers\GlobalRealtimeObserver::class);
        // Note: Users are handled carefully to avoid loops, but can be added if needed
        // \App\Models\User::observe(\App\Observers\GlobalRealtimeObserver::class);
    }
}

