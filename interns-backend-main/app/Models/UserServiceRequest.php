<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserServiceRequest extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'priority', 'status', 'category', 
        'projectRelated', 'urgency', 'expectedResolution', 'additionalNotes', 'feedback'
    ];

    protected $casts = [
        'feedback' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

