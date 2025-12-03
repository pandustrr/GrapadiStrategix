<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ManagementFinancial\FinancialSimulation;
use App\Observers\FinancialSimulationObserver;

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
        // Register FinancialSimulation Observer
        FinancialSimulation::observe(FinancialSimulationObserver::class);
    }
}
