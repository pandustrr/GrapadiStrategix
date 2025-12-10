<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PDFExportRequest extends Model
{
    use HasFactory;

    protected $table = 'pdf_export_requests';

    protected $fillable = [
        'user_id',
        'export_type', // business_plan, financial_plan, forecast
        'business_id',
        'package', // professional, business
        'amount',
        'year',
        'month',
        'status', // pending_payment, completed, failed, expired
        'payment_method', // virtual_account, qris, payment_link
        'payment_va_number',
        'payment_va_bank',
        'payment_qris_data',
        'payment_link',
        'singapay_reference_id',
        'payment_expires_at',
        'paid_at',
        'pdf_path',
        'pdf_filename',
        'pdf_download_url',
    ];

    protected $casts = [
        'payment_expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class, 'business_id');
    }

    public function singapayPayment()
    {
        return $this->hasOne(SingapayPayment::class, 'export_request_id');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending_payment');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired')
            ->orWhere('payment_expires_at', '<', now());
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByExportType($query, $exportType)
    {
        return $query->where('export_type', $exportType);
    }

    /**
     * Helpers
     */
    public function isPaid()
    {
        return $this->status === 'completed';
    }

    public function isExpired()
    {
        return $this->payment_expires_at && $this->payment_expires_at < now();
    }

    public function isPending()
    {
        return $this->status === 'pending_payment';
    }

    public function getStatusLabel()
    {
        $labels = [
            'pending_payment' => 'Menunggu Pembayaran',
            'completed' => 'Selesai',
            'failed' => 'Gagal',
            'expired' => 'Kadaluarsa',
        ];

        return $labels[$this->status] ?? $this->status;
    }

    /**
     * Generate download token (untuk secure download link)
     */
    public function generateDownloadToken()
    {
        return hash('sha256', $this->id . $this->user_id . $this->pdf_path . time());
    }
}
