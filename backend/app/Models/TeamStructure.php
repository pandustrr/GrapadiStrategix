<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_background_id',
        'team_category',
        'member_name',
        'position',
        'experience',
        'photo',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessBackground()
    {
        return $this->belongsTo(BusinessBackground::class);
    }
}
