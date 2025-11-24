<?php

namespace App\Models\ManagementFinancial;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinancialSummary extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'financial_summaries';

    protected $fillable = [
        'user_id',
        'business_background_id',
        'month',
        'year',
        'total_income',
        'total_expense',
        'gross_profit',
        'net_profit',
        'cash_position',
        'income_breakdown',
        'expense_breakdown',
        'notes'
    ];

    protected $casts = [
        'total_income' => 'decimal:2',
        'total_expense' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'net_profit' => 'decimal:2',
        'cash_position' => 'decimal:2',
        'income_breakdown' => 'array',
        'expense_breakdown' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Relationship with Business Background
     */
    public function businessBackground()
    {
        return $this->belongsTo(\App\Models\BusinessBackground::class);
    }

    /**
     * Get month name attribute
     */
    public function getMonthNameAttribute()
    {
        try {
            $months = [
                1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
                5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
                9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
            ];
            return $months[$this->month] ?? 'Bulan ' . $this->month;
        } catch (\Exception $e) {
            return 'Bulan ' . $this->month;
        }
    }

    /**
     * Get period attribute (Month Year)
     */
    public function getPeriodAttribute()
    {
        return $this->monthName . ' ' . $this->year;
    }

    /**
     * Calculate profit margin percentage
     */
    public function getProfitMarginAttribute()
    {
        if ($this->total_income > 0) {
            return ($this->gross_profit / $this->total_income) * 100;
        }
        return 0;
    }

    /**
     * Check if summary is for current month
     */
    public function getIsCurrentMonthAttribute()
    {
        return $this->month == now()->month && $this->year == now()->year;
    }

    /**
     * Scope for specific month and year
     */
    public function scopeForPeriod($query, $month, $year)
    {
        return $query->where('month', $month)->where('year', $year);
    }

    /**
     * Scope for specific year
     */
    public function scopeForYear($query, $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Scope for specific business
     */
    public function scopeForBusiness($query, $businessId)
    {
        return $query->where('business_background_id', $businessId);
    }
}
