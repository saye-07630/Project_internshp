<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class AdminNotificationSeeder extends Seeder
{
    public function run()
    {
        // Get admin users (assuming admin users have role 'admin' or similar)
        $adminUsers = User::where('role', 'admin')->orWhere('email', 'like', '%admin%')->get();
        
        if ($adminUsers->count() == 0) {
            // If no admin users found, create notifications for all users
            $adminUsers = User::all();
        }
        
        $adminNotifications = [
            [
                'type' => 'warning',
                'title' => 'New Service Request Received',
                'message' => 'A new service request has been submitted and requires your attention.',
            ],
            [
                'type' => 'info',
                'title' => 'User Registration Alert',
                'message' => 'A new user has registered on the platform.',
            ],
            [
                'type' => 'success',
                'title' => 'Project Status Update',
                'message' => 'A project has been marked as completed.',
            ],
            [
                'type' => 'warning',
                'title' => 'System Maintenance Required',
                'message' => 'Scheduled system maintenance is due in 24 hours.',
            ],
            [
                'type' => 'info',
                'title' => 'Monthly Report Available',
                'message' => 'The monthly system report is now available for review.',
            ],
            [
                'type' => 'warning',
                'title' => 'High Priority Service Request',
                'message' => 'A high priority service request requires immediate attention.',
            ],
            [
                'type' => 'success',
                'title' => 'User Feedback Received',
                'message' => 'New user feedback has been submitted for review.',
            ],
            [
                'type' => 'info',
                'title' => 'Database Backup Completed',
                'message' => 'Daily database backup has been completed successfully.',
            ],
            [
                'type' => 'warning',
                'title' => 'Server Performance Alert',
                'message' => 'Server performance metrics indicate potential issues.',
            ],
            [
                'type' => 'success',
                'title' => 'Security Scan Completed',
                'message' => 'Weekly security scan has been completed with no issues found.',
            ]
        ];
        
        foreach ($adminUsers as $admin) {
            foreach ($adminNotifications as $notificationData) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => $notificationData['type'],
                    'title' => $notificationData['title'],
                    'message' => $notificationData['message'],
                    'is_read' => false,
                    'data' => json_encode(['created_by' => 'system', 'admin_notification' => true])
                ]);
            }
        }
        
        $this->command->info('Successfully created ' . (count($adminNotifications) * $adminUsers->count()) . ' admin notifications for ' . $adminUsers->count() . ' admin users.');
    }
}

