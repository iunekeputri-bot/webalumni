<?php

namespace App\Events;

use App\Models\JobApplication;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JobApplicationSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $application;

    /**
     * Create a new event instance.
     */
    public function __construct(JobApplication $application)
    {
        $this->application = $application;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        // Broadcast to the company who owns the job posting
        // Loading the job posting to get company_id
        $this->application->load('jobPosting');
        return [
            new PrivateChannel('App.Models.User.' . $this->application->jobPosting->company_id),
        ];
    }

    public function broadcastWith()
    {
        return [
            'application' => $this->application->load(['alumni', 'jobPosting']),
            'message' => 'Lamaran baru masuk untuk ' . $this->application->jobPosting->title,
        ];
    }
}
