<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SingapayPayment extends Model
{
    use HasFactory;

    protected $table = 'singapay_payments';

    protected $fillable = [
        'export_request_id',
        'reference_id',
        'singapay_transaction_id',
        'amount',
        'payment_method', // virtual_account, qris, payment_link
        'bank_code',
        'va_number',
        'status', // pending, settled, failed, cancelled
        'response_data',
        'webhook_data',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'response_data' => 'json',
        'webhook_data' => 'json',
        'paid_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function exportRequest()
    {
        return $this->belongsTo(PDFExportRequest::class, 'export_request_id');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSettled($query)
    {
        return $query->where('status', 'settled');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeByReferenceId($query, $referenceId)
    {
        return $query->where('reference_id', $referenceId);
    }

    public function scopeByTransactionId($query, $transactionId)
    {
        return $query->where('singapay_transaction_id', $transactionId);
    }

    /**
     * Helpers
     */
    public function isPaid()
    {
        return $this->status === 'settled';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }

    public function getStatusLabel()
    {
        $labels = [
            'pending' => 'Menunggu Pembayaran',
            'settled' => 'Terbayar',
            'failed' => 'Gagal',
            'cancelled' => 'Dibatalkan',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    /**
     * Get display amount
     */
    public function getFormattedAmount()
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }
}
