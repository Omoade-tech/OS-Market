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
            'message' => 'required|string|max:1000',
        ]);

        try {
            $message = Message::create([
                'sender_id' => Auth::id(),
                'receiver_id' => $request->receiver_id,
                'message' => $request->message,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully.',
                'data' => $message,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all messages for the authenticated user's dashboard.
     */
    public function dashboard()
    {
        try {
            $userId = Auth::id();
            
            // Get all messages where user is either sender or receiver
            $messages = Message::where('sender_id', $userId)
                ->orWhere('receiver_id', $userId)
                ->with(['sender', 'receiver'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'messages' => $messages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch messages.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get conversation with a specific user.
     */
    public function conversation($userId)
    {
        $authId = Auth::id();

        try {
            $messages = Message::where(function ($query) use ($authId, $userId) {
                    $query->where('sender_id', $authId)
                          ->where('receiver_id', $userId);
                })
                ->orWhere(function ($query) use ($authId, $userId) {
                    $query->where('sender_id', $userId)
                          ->where('receiver_id', $authId);
                })
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'conversation' => $messages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
