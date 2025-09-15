<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\UserManagement;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // GET all projects
   public function index(Request $request)
    {
        $query = Project::query();

        if ($request->has('client_name')) {
            $query->where('client_name', 'like', '%'.$request->client_name.'%');
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('date_received', 'desc')->get());
    }

    // View single project
    public function show($id)
    {
   return response()->json(Project::findOrFail($id));
    }
    // Delete project
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
    
}
