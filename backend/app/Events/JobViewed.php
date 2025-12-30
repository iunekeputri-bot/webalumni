<?php

namespace App\Events;

use App\Models\JobPosting;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JobViewed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $jobId;
    public $viewsCount;
    public $companyId;
    public $viewer;

    /**
     * Create a new event instance.
     */
    public function __construct(JobPosting $jobPosting, $viewer = null)
    {
        $this->jobId = $jobPosting->id;
        $this->viewsCount = $jobPosting->views;
        $this->companyId = $jobPosting->company_id;
        $this->viewer = $viewer ? [
            'name' => $viewer->name,
            'id' => $viewer->id
        ] : null;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            // Channel for the company to update their stats
            new PrivateChannel('App.Models.User.' . $this->companyId),
            // Public channel for live view counts (optional, if we want everyone to see view counts update)
            new Channel('jobs'),
        ];
    }

    public function broadcastWith()
    {
        return [
            'job_id' => $this->jobId,
            'views' => $this->viewsCount,
            'viewer' => $this->viewer,
        ];
    }
}
