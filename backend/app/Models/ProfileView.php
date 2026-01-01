<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileView extends Model
{
    protected $table = 'profile_views';

    protected $fillable = [
        'alumni_id',
        'viewer_id',
        'viewed_at',
    ];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class);
    }

    public function viewer()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }
}
