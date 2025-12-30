<?php

namespace App\Events;

use App\Models\Alumni;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlumniProfileUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $alumni;

    /**
     * Create a new event instance.
     */
    public function __construct(Alumni $alumni)
    {
        $this->alumni = $alumni;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        // Broadcast to general alumni-updates channel (for companies looking for candidates)
        // and admin-updates channel
        return [
            new Channel('alumni-updates'),
            new PrivateChannel('admin-updates'),
        ];
    }

    public function broadcastWith()
    {
        return [
            'alumni' => $this->alumni,
            'message' => 'Profil alumni diperbarui: ' . $this->alumni->name,
        ];
    }
}
