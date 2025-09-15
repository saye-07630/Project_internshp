<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMessage extends Model
{
    // Add user() relationship for compatibility with controller eager loading
    public function user()
    {
        // Assuming 'user_id' is the sender (for legacy compatibility)
        return $this->belongsTo(User::class, 'user_id');
    }
    protected $fillable = [
        'sender_id', 'receiver_id', 'subject', 'message', 'is_read'
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}

