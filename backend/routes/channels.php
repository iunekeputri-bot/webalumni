<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat channel - user can only listen to their own messages
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Conversations channel - user can only listen to their own conversations
Broadcast::channel('conversations.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Public jobs channel
Broadcast::channel('jobs', function ($user) {
    return true; // Everyone can listen
});

// Admin updates channel - only admins can listen
Broadcast::channel('admin-updates', function ($user) {
    return $user->role === 'admin' || $user->role === 'super_admin';
});

// Global presence channel for online status
Broadcast::channel('presence-global', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
});
