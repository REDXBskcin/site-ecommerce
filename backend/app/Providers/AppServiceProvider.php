<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
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
     * defaultStringLength(191) évite l'erreur MySQL "key too long" avec utf8mb4 (index sur varchar 255).
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
    }
}
