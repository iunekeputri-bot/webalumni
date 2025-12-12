<?php

namespace App\Http\Controllers;

use App\Message;
use App\User;
use App\Events\MessageSent;
use App\Events\ConversationUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function __construct()
    {
        // Authentication not required for demo purposes
    }

    /**
     * Get all conversations for a user
     */
    public function getConversations(Request $request)
    {
        $userId = Auth::id();

        $conversations = DB::select("
            SELECT
                u.id as user_id,
                u.name,
                u.email,
                (
                    SELECT message
                    FROM messages m2
                    WHERE (m2.sender_id = ? AND m2.receiver_id = u.id)
                       OR (m2.receiver_id = ? AND m2.sender_id = u.id)
                    ORDER BY m2.created_at DESC
                    LIMIT 1
                ) as last_message,
                (
                    SELECT created_at
                    FROM messages m3
                    WHERE (m3.sender_id = ? AND m3.receiver_id = u.id)
                       OR (m3.receiver_id = ? AND m3.sender_id = u.id)
                    ORDER BY m3.created_at DESC
                    LIMIT 1
                ) as last_message_time,
                (
                    SELECT COUNT(*)
                    FROM messages m4
                    WHERE m4.receiver_id = ?
                      AND m4.sender_id = u.id
                      AND m4.is_read = 0
                ) as unread_count
            FROM users u
            JOIN (
                SELECT DISTINCT
                    CASE
                        WHEN sender_id = ? THEN receiver_id
                        ELSE sender_id
                    END as partner_id
                FROM messages
                WHERE sender_id = ? OR receiver_id = ?
            ) as partners ON u.id = partners.partner_id
            ORDER BY last_message_time DESC
        ", [
            $userId, $userId, // last_message
            $userId, $userId, // last_message_time
            $userId,          // unread_count
            $userId, $userId, $userId // partners
        ]);

        // Format dates to ISO 8601 to ensure correct timezone handling in frontend
        foreach ($conversations as $conversation) {
            if ($conversation->last_message_time) {
                $conversation->last_message_time = \Carbon\Carbon::parse($conversation->last_message_time)->toIso8601String();
            }
        }

        return response()->json($conversations);
    }    /**
     * Get messages between two users
     */
    public function getMessages(Request $request, $userId, $otherUserId)
    {
        // If userId is not provided or invalid, use the authenticated user
        if (!$userId) {
            $userId = Auth::id();
        }

        $messages = Message::where(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $otherUserId);
        })->orWhere(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $otherUserId)
                  ->where('receiver_id', $userId);
        })
        ->with(['sender', 'receiver'])
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark messages as read
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        // Get the authenticated user
        $userId = Auth::id();

        $message = Message::create([
            'sender_id' => $userId,
            'receiver_id' => $validated['receiver_id'],
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        $message->load(['sender', 'receiver']);

        // Return response immediately - broadcasting is handled async via polling on frontend
        // This makes the API response instant instead of waiting for WebSocket broadcast
        return response()->json($message, 201);
    }    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request)
    {
        $validated = $request->validate([
            'other_user_id' => 'required|exists:users,id',
        ]);

        Message::where('sender_id', $validated['other_user_id'])
            ->where('receiver_id', Auth::user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
    /**
     * Delete conversation between two users
     */
    public function deleteConversation(Request $request, $userId, $otherUserId)
    {
        $currentUserId = Auth::id();

        // Ensure we are deleting for the logged in user
        $deleted = DB::table('messages')->where(function ($query) use ($currentUserId, $otherUserId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $otherUserId);
        })->orWhere(function ($query) use ($currentUserId, $otherUserId) {
            $query->where('sender_id', $otherUserId)
                  ->where('receiver_id', $currentUserId);
        })->delete();

        return response()->json([
            'success' => true,
            'message' => 'Percakapan berhasil dihapus',
            'deleted_count' => $deleted,
        ]);
    }

    /**
     * Helper method to get conversation data between two users
     */
    private function getConversationData($userId, $otherUserId)
    {
        $otherUser = User::find($otherUserId);

        $lastMessage = Message::where(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $otherUserId);
        })->orWhere(function ($query) use ($userId, $otherUserId) {
            $query->where('sender_id', $otherUserId)
                  ->where('receiver_id', $userId);
        })->orderBy('created_at', 'desc')->first();

        $unreadCount = Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->count();

        return [
            'user_id' => $otherUser->id,
            'name' => $otherUser->name,
            'email' => $otherUser->email,
            'avatar' => $otherUser->avatar ?? null,
            'last_message' => $lastMessage ? $lastMessage->message : '',
            'last_message_time' => $lastMessage ? $lastMessage->created_at->toIso8601String() : now()->toIso8601String(),
            'unread_count' => $unreadCount,
        ];
    }
}
