<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke business background
    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class, 'business_background_id');
    }
}
