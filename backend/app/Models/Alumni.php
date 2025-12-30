<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    protected $table = 'alumni';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'birth_date',
        'nisn',
        'phone',
        'major',
        'graduation_year',
        'status',
        'join_date',
        'bio',
        'skills',
        'work_status',
        'avatar'
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}



