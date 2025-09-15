<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\UserServiceRequest;

class OverviewController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();

        $activeProjects = Project::whereIn('status', ['Planning', 'Review', 'In Progress'])->count();

        $pendingRequests = UserServiceRequest::where('status', 'Pending')->count();

        $recentProjects = Project::orderBy('id', 'desc')->take(3)->get();

        $recentRequests = UserServiceRequest::orderBy('id', 'desc')->take(3)->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'active_projects' => $activeProjects,
                'pending_requests' => $pendingRequests,
            ],
            'recent_projects' => $recentProjects,
            'recent_requests' => $recentRequests,
        ]);
    }
}
