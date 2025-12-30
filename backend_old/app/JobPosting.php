<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobPosting extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'requirements',
        'salary_range',
        'location',
        'job_type',
        'position',
        'status',
    ];

    protected $casts = [
        'requirements' => 'array',
        'applicants' => 'integer',
        'views' => 'integer',
    ];

    protected $appends = ['salary', 'type', 'applicants', 'views'];

    /**
     * Get the company that owns the job posting
     */
    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    /**
     * Get all applications for this job
     */
    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    /**
     * Scope to get only active jobs
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Increment views count
     */
    public function incrementViews()
    {
        $this->increment('views');
    }

    /**
     * Update applicants count
     */
    public function updateApplicantsCount()
    {
        // No need to save count to DB if we calculate it dynamically
    }

    // Accessors for frontend compatibility
    public function getSalaryAttribute()
    {
        return $this->salary_range;
    }

    public function getTypeAttribute()
    {
        return $this->job_type;
    }

    public function getApplicantsAttribute()
    {
        return $this->applications()->count();
    }

    public function getViewsAttribute()
    {
        return 0; // Placeholder
    }
}
