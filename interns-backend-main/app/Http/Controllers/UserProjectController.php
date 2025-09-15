<?php

namespace App\Http\Controllers;

use App\Models\UserProject;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserProjectController extends Controller
{
    // Store a new user project
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'projectType' => 'required|string',
            'budget' => 'nullable|numeric',
            'timeline' => 'required|string',
            'requirements' => 'nullable|string',
            'features' => 'nullable|string',
            'targetAudience' => 'nullable|string',
            'additionalNotes' => 'nullable|string',
        ]);

        // Create a new project
        $project = Project::create([
            'client_name' => Auth::user()->name,
            'client_email' => Auth::user()->email,
            'project_title' => $validated['title'],
            'type' => $validated['projectType'],
            'timeline' => $validated['timeline'],
            'date_received' => now()->toDateString(),
            'status' => 'Pending Review'
        ]);

        // Create user project relationship
        $userProject = UserProject::create([
            'user_id' => Auth::id(),
            'project_id' => $project->id
        ]);

        return response()->json([
            'message' => 'Project request submitted successfully',
            'data' => $project
        ], 201);
    }

    // List all projects assigned to the user
    public function index()
    {
        $userProjects = UserProject::where('user_id', Auth::id())
            ->with(['project' => function($query) {
                $query->select('id', 'client_name', 'client_email', 'project_title', 'type', 'timeline', 'date_received', 'status');
            }])
            ->latest()
            ->get();

        // Transform the data to match frontend expectations
        $projects = $userProjects->map(function($userProject) {
            $project = $userProject->project;
            return [
                'id' => $project->id,
                'title' => $project->project_title,
                'description' => 'Project description', // You might want to add this field to the projects table
                'type' => $project->type,
                'status' => $project->status,
                'timeline' => $project->timeline,
                'submittedDate' => $project->date_received,
                'clientName' => $project->client_name,
                'clientEmail' => $project->client_email,
                'progress' => $this->getProgressFromStatus($project->status),
                'priority' => 'Medium', // Default priority
                'budget' => 0, // Default budget
                'spent' => 0, // Default spent
                'startDate' => $project->date_received,
                'endDate' => $this->calculateEndDate($project->date_received, $project->timeline),
                'clientId' => Auth::id(),
                'clientName' => $project->client_name,
            ];
        });

        return response()->json($projects);
    }

    // Show details of a specific project
    public function show(UserProject $userproject)
    {
        $this->authorize('view', $userproject);
        
        $project = $userproject->project;
        return response()->json([
            'id' => $project->id,
            'title' => $project->project_title,
            'description' => 'Project description', // You might want to add this field to the projects table
            'type' => $project->type,
            'status' => $project->status,
            'timeline' => $project->timeline,
            'submittedDate' => $project->date_received,
            'clientName' => $project->client_name,
            'clientEmail' => $project->client_email,
            'progress' => $this->getProgressFromStatus($project->status),
            'priority' => 'Medium', // Default priority
            'budget' => 0, // Default budget
            'spent' => 0, // Default spent
            'startDate' => $project->date_received,
            'endDate' => $this->calculateEndDate($project->date_received, $project->timeline),
            'clientId' => Auth::id(),
            'clientName' => $project->client_name,
        ]);
    }

    private function getProgressFromStatus($status)
    {
        switch ($status) {
            case 'Pending Review':
                return 10;
            case 'Under Review':
                return 25;
            case 'Approved':
                return 50;
            case 'In Progress':
                return 75;
            case 'Completed':
                return 100;
            default:
                return 0;
        }
    }

    private function calculateEndDate($startDate, $timeline)
    {
        $start = \Carbon\Carbon::parse($startDate);
        
        if (strpos($timeline, 'week') !== false) {
            $weeks = (int) filter_var($timeline, FILTER_SANITIZE_NUMBER_INT);
            return $start->addWeeks($weeks)->toDateString();
        } elseif (strpos($timeline, 'month') !== false) {
            $months = (int) filter_var($timeline, FILTER_SANITIZE_NUMBER_INT);
            return $start->addMonths($months)->toDateString();
        } else {
            // Default to 3 months if timeline format is not recognized
            return $start->addMonths(3)->toDateString();
        }
    }
}
