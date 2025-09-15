<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserMessage;
use App\Models\User;

use Illuminate\Support\Facades\Auth;

class MessageController extends Controller

{
    // 1️⃣ List all messages (for admin)
    public function index()
    {
        $messages = \App\Models\UserMessage::with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get();

        $transformed = $messages->map(function($msg) {
            return [
                'id' => $msg->id,
                'sender_id' => $msg->sender_id,
                'sender' => $msg->sender ? $msg->sender->name : null,
                'sender_email' => $msg->sender ? $msg->sender->email : null,
                'recipient_id' => $msg->receiver_id,
                'recipient' => $msg->receiver ? $msg->receiver->name : null,
                'recipient_email' => $msg->receiver ? $msg->receiver->email : null,
                'subject' => $msg->subject,
                'message' => $msg->message,
                'is_read' => $msg->is_read,
                'created_at' => $msg->created_at,
                'updated_at' => $msg->updated_at
            ];
        });
        return response()->json(['success' => true, 'data' => $transformed]);
    }

    // Send a new message (admin selects recipient name)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => 'required|string|exists:users,name',
            'subject'        => 'required|string|max:255',
            'message'        => 'required|string',
        ]);

        // Find recipient by name
        $recipient = User::where('name', $validated['recipient_name'])->first();
        $admin = Auth::user();

        $message = UserMessage::create([
            'sender_id'   => $admin->id,
            'receiver_id' => $recipient->id,
            'subject'     => $validated['subject'],
            'message'     => $validated['message'],
            'is_read'     => false,
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data'    => $message->load(['sender', 'receiver'])
        ], 201);
    }

    // Mark message as read
    public function markAsRead($id)
    {
        $message = UserMessage::findOrFail($id);
        $message->update(['read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }

    // Reply to a message
    public function reply(Request $request, $id)
    {
        $original = UserMessage::findOrFail($id);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $reply = UserMessage::create([
            'user_id'    => $original->user_id,
            'to_name'    => 'Admin',
            'to_email'   => 'admin@hawi.com',
            'subject'    => "Re: " . $original->subject,   
            'content'    => $validated['content'],
            'read'       => false,
            'status'     => 'sent'
        ]);

        return response()->json([
            'message' => 'Reply sent successfully',
            'data'    => $reply->load('user')
        ]);
    }

    // Delete a message
    public function destroy($id)
    {
        $message = UserMessage::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Message deleted']);
    }
}