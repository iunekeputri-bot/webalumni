<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GlobalRealtimeUpdate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type;
    public $action;
    public $data;

    /**
     * Create a new event instance.
     */
    public function __construct($type, $action, $data)
    {
        $this->type = $type;
        $this->action = $action;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast to all role-based channels
        // This allows any role to potentially receive the update if they are listening
        return [
            new PrivateChannel('global.role.super_admin'),
            new PrivateChannel('global.role.admin'),
            new PrivateChannel('global.role.company'),
            new PrivateChannel('global.role.alumni'),
        ];
    }

    public function broadcastAs()
    {
        return 'GlobalRealtimeUpdate';
    }
}
