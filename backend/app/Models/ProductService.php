<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductService extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_background_id',
        'type',
        'name',
        'description',
        'price',
        'image_path',
        'advantages',
        'development_strategy',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class);
    }

    // Accessor untuk full image URL
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return null;
    }

    // Append accessor to JSON response
    protected $appends = ['image_url'];

    // Scope untuk filter
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByBusiness($query, $businessId)
    {
        return $query->where('business_background_id', $businessId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
