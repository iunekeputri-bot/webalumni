<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $table = 'job_applications';

    protected $fillable = [
        'job_posting_id',
        'alumni_id',
        'user_id',
        'cover_letter',
        'status',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the job posting
     */
    public function jobPosting()
    {
        return $this->belongsTo('App\JobPosting')->withTrashed();
    }

    /**
     * Get the alumni who applied
     */
    public function alumni()
    {
        return $this->belongsTo('App\Alumni');
    }

    /**
     * Get the user who applied
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Get documents submitted with this application
     */
    public function documents()
    {
        return $this->belongsToMany('App\Document', 'application_documents', 'application_id', 'document_id');
    }
}
