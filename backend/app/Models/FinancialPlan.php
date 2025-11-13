<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_background_id',
        'capital_source',
        'initial_capex',
        'monthly_operational_cost',
        'estimated_monthly_income',
        'profit_loss_estimation',
        'notes'
    ];

    protected $casts = [
        'initial_capex' => 'decimal:2',
        'monthly_operational_cost' => 'decimal:2',
        'estimated_monthly_income' => 'decimal:2',
        'profit_loss_estimation' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::saving(function ($plan) {
            // Hitung otomatis laba/rugi sederhana
            if ($plan->estimated_monthly_income && $plan->monthly_operational_cost) {
                $plan->profit_loss_estimation = $plan->estimated_monthly_income - $plan->monthly_operational_cost;
            }
        });
    }

    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
