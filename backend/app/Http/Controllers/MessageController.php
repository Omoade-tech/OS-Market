<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Send a message from the authenticated user to another user.
     */
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string'
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'read' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $message->load('sender:id,name,email')
        ]);
    }

    /**
     * Get all messages for the authenticated user's dashboard.
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // Get all messages where the authenticated user is the receiver
        $messages = Message::where('receiver_id', $user->id)
            ->with(['sender' => function($query) {
                $query->select('id', 'name', 'email');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('sender_id')
            ->map(function($group) {
                $lastMessage = $group->first();
                return [
                    'id' => $lastMessage->sender_id,
                    'sender_name' => $lastMessage->sender->name,
                    'last_message' => $lastMessage->message,
                    'last_message_at' => $lastMessage->created_at,
                    'read' => $lastMessage->read,
                    'unread_count' => $group->where('read', false)->count()
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }

    /**
     * Get conversation with a specific user.
     */
    public function conversation($userId)
    {
        $user = Auth::user();
        
        // Get all messages between the authenticated user and the specified user
        $messages = Message::where(function($query) use ($user, $userId) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', $userId);
            })
            ->orWhere(function($query) use ($user, $userId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', $user->id);
            })
            ->with(['sender' => function($query) {
                $query->select('id', 'name', 'email');
            }])
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        Message::where('sender_id', $userId)
            ->where('receiver_id', $user->id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json([
            'success' => true,
            'conversation' => $messages
        ]);
    }
}
