<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserMessage;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    // 1️⃣ List all messages (for admin)
    public function index()
    {
        try {
            // For admin, get all messages where admin (ID 2) is sender or receiver
            $adminId = 2;
            $messages = UserMessage::with(['sender', 'receiver'])
                ->where(function($query) use ($adminId) {
                    $query->where('sender_id', $adminId)
                          ->orWhere('receiver_id', $adminId);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            // Filter out messages with missing sender or receiver
            $filteredMessages = $messages->filter(function($message) {
                return $message->sender !== null && $message->receiver !== null;
            });

            // Transform the data to match frontend expectations
            $transformedMessages = $filteredMessages->map(function($message) {
                return [
                    'id' => $message->id,
                    'sender' => $message->sender ? $message->sender->name : 'Unknown Sender',
                    'sender_id' => $message->sender_id,
                    'sender_email' => $message->sender ? $message->sender->email : 'unknown@example.com',
                    'email' => $message->sender ? $message->sender->email : 'unknown@example.com',
                    'recipient' => $message->receiver ? $message->receiver->name : 'Admin',
                    'recipient_id' => $message->receiver_id,
                    'subject' => $message->subject ?? 'No Subject',
                    'content' => $message->message,
                    'message' => $message->message, // For backward compatibility
                    'is_read' => $message->is_read,
                    'read' => $message->is_read, // For backward compatibility
                    'created_at' => $message->created_at,
                    'updated_at' => $message->updated_at,
                    'type' => 'user_message'
                ];
            });

            return response()->json($transformedMessages);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Send a new message (admin selects recipient name)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_name' => 'required|string', // frontend sends name
            'subject'        => 'required|string|max:255',
            'content'        => 'required|string',
        ]);

        // Find recipient by name
        $recipient = User::where('name', $validated['recipient_name'])->first();
        
        if (!$recipient) {
            return response()->json([
                'error' => 'Recipient not found',
                'message' => 'The selected recipient does not exist in the system.'
            ], 404);
        }

        // For admin messages, we'll create them as if they're from the admin
        // Since this is an admin endpoint, we don't need to track the sender

        $message = UserMessage::create([
            'sender_id'    => 2,     // Admin sender ID (should be 2)
            'receiver_id'  => $recipient->id,     // store user ID
            'subject'      => $validated['subject'],
            'message'      => $validated['content'],
            'is_read'      => false
        ]);

        // Create notification for the recipient
        Notification::create([
            'user_id' => $recipient->id,
            'type' => 'info',
            'title' => 'New Message from Admin',
            'message' => 'You have received a new message: ' . $validated['subject'],
            'is_read' => false,
            'data' => [
                'message_id' => $message->id,
                'sender_id' => 2,
                'sender_name' => 'Admin',
                'subject' => $validated['subject']
            ]
        ]);

        return response()->json([
            'message' => 'Message sent successfully',
            'data'    => $message->load('sender', 'receiver')
        ], 201);
    }

    // Mark message as read
    public function markAsRead($id)
    {
        $message = UserMessage::findOrFail($id);
        $message->update(['is_read' => true]);

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
            'sender_id'    => 2,     // Admin sender ID (should be 2)
            'receiver_id'  => $original->sender_id,  // Reply to original sender
            'subject'      => "Re: " . $original->subject,   
            'message'      => $validated['content'],
            'is_read'      => false
        ]);

        // Create notification for the recipient
        if ($original->sender_id) {
            Notification::create([
                'user_id' => $original->sender_id,
                'type' => 'info',
                'title' => 'New Reply from Admin',
                'message' => 'You have received a reply to your message: ' . $original->subject,
                'is_read' => false,
                'data' => [
                    'message_id' => $reply->id,
                    'original_message_id' => $original->id,
                    'sender_id' => 2,
                    'sender_name' => 'Admin',
                    'subject' => $reply->subject
                ]
            ]);
        }

        return response()->json([
            'message' => 'Reply sent successfully',
            'data'    => $reply->load('sender', 'receiver')
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
