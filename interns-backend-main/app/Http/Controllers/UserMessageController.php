<?php
namespace App\Http\Controllers;

use App\Models\UserMessage;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserMessageController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $messages = UserMessage::where(function($query) use ($userId) {
            $query->where('sender_id', $userId)
                  ->orWhere('receiver_id', $userId);
        })
        ->with(['sender', 'receiver'])
        ->orderBy('created_at', 'desc')
        ->get();

        $transformed = $messages->map(function($msg) use ($userId) {
            return [
                'id' => $msg->id,
                'subject' => $msg->subject,
                'message' => $msg->message,
                'from' => $msg->sender ? $msg->sender->name : null,
                'fromId' => $msg->sender_id,
                'fromEmail' => $msg->sender ? $msg->sender->email : null,
                'to' => $msg->receiver ? $msg->receiver->name : null,
                'toId' => $msg->receiver_id,
                'toEmail' => $msg->receiver ? $msg->receiver->email : null,
                'is_read' => $msg->is_read,
                'timestamp' => $msg->created_at->format('M d, Y H:i'),
                'createdAt' => $msg->created_at->toISOString(),
                'type' => $msg->sender_id == $userId ? 'sent' : 'received'
            ];
        });
        return response()->json(['success' => true, 'data' => $transformed->values()]);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('UserMessage store method called', [
                'request_data' => $request->all(),
                'auth_user' => Auth::id(),
                'headers' => $request->headers->all()
            ]);

            $validated = $request->validate([
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
                'receiver_id' => 'required|integer|exists:users,id'
            ]);

            $usermessage = UserMessage::create([
                'sender_id' => Auth::id(),
                'receiver_id' => $validated['receiver_id'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'is_read' => false
            ]);

            $adminUser = User::find($validated['receiver_id']);
            if ($adminUser) {
                Notification::create([
                    'user_id' => $adminUser->id,
                    'type' => 'info',
                    'title' => 'New Message Received',
                    'message' => 'You have received a new message from ' . Auth::user()->name,
                    'is_read' => false,
                    'data' => [
                        'message_id' => $usermessage->id,
                        'sender_id' => Auth::id(),
                        'sender_name' => Auth::user()->name,
                        'subject' => $validated['subject']
                    ]
                ]);
            }

            return response()->json(['success' => true, 'message' => 'Message sent successfully']);
        } catch (\Exception $e) {
            \Log::error('UserMessage store error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['success' => false, 'message' => 'Failed to send message', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, UserMessage $usermessage)
    {
        // Check if user is sender or receiver
        if ($usermessage->sender_id !== Auth::id() && $usermessage->receiver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'subject' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
        ]);

        $usermessage->update($validated);
        return response()->json($usermessage);
    }

    public function destroy(UserMessage $usermessage)
    {
        // Check if user is sender or receiver
        if ($usermessage->sender_id !== Auth::id() && $usermessage->receiver_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $usermessage->delete();
        return response()->json(['message' => 'Message deleted successfully']);
    }
}