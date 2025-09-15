<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Notification;
use App\Models\User;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Get all users
    $users = User::all();
    
    if ($users->count() == 0) {
        echo "No users found. Please create users first.\n";
        exit;
    }
    
    // Create sample notifications for each user
    $notifications = [
        [
            'type' => 'info',
            'title' => 'Welcome to Hawi Software Dashboard',
            'message' => 'Your account has been successfully set up. You can now access all features.',
        ],
        [
            'type' => 'success',
            'title' => 'Project Update Available',
            'message' => 'A new progress update has been posted for your project.',
        ],
        [
            'type' => 'warning',
            'title' => 'Service Request Status Changed',
            'message' => 'Your service request status has been updated to "In Progress".',
        ],
        [
            'type' => 'info',
            'title' => 'New Message Received',
            'message' => 'You have received a new message from the admin team.',
        ],
        [
            'type' => 'success',
            'title' => 'Profile Updated Successfully',
            'message' => 'Your profile information has been updated successfully.',
        ]
    ];
    
    foreach ($users as $user) {
        foreach ($notifications as $notificationData) {
            Notification::create([
                'user_id' => $user->id,
                'type' => $notificationData['type'],
                'title' => $notificationData['title'],
                'message' => $notificationData['message'],
                'is_read' => false,
                'data' => json_encode(['created_by' => 'system'])
            ]);
        }
    }
    
    echo "Successfully created " . (count($notifications) * $users->count()) . " notifications for " . $users->count() . " users.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

