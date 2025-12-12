<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $conversation;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($userId, $conversation)
    {
        $this->userId = $userId;
        $this->conversation = $conversation;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('conversations.' . $this->userId);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'conversation.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'user_id' => $this->conversation['user_id'],
            'name' => $this->conversation['name'],
            'email' => $this->conversation['email'],
            'avatar' => $this->conversation['avatar'] ?? null,
            'last_message' => $this->conversation['last_message'],
            'last_message_time' => $this->conversation['last_message_time'],
            'unread_count' => $this->conversation['unread_count'],
        ];
    }
}
