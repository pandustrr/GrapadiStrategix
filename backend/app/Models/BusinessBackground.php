<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusinessBackground extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'logo',
        'name',
        'category',
        'description',
        'purpose',
        'location',
        'business_type',
        'start_date',
        'values',
        'vision',
        'mission',
        'contact',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
