<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjectProgressUpdate;
use Illuminate\Http\Request;
use App\Models\User;

class ProjectProgressController extends Controller
{
    // 1️⃣ List all progress updates
    public function index()
    {
        try {
            $updates = ProjectProgressUpdate::with('client')->orderBy('created_at', 'desc')->get();
            return response()->json($updates);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // 2️⃣ Store a new progress update (client selected by name)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project' => 'required|string|max:255',
            'client_name' => 'required|string|exists:users,name', // frontend sends client name
            'progress' => 'required|integer|min:0|max:100',
            'current_status' => 'required|string|max:255',
            'completed_milestones' => 'nullable|string',
            'next_deadline' => 'nullable|date',
            'last_update' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $client = User::where('name', $validated['client_name'])->first();

        $update = ProjectProgressUpdate::create([
            'project' => $validated['project'],
            'client_id' => $client->id,
            'progress' => $validated['progress'],
            'current_status' => $validated['current_status'],
            'completed_milestones' => $validated['completed_milestones'] ?? null,
            'next_deadline' => $validated['next_deadline'] ?? null,
            'last_update' => $validated['last_update'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Progress update sent successfully',
            'data' => $update->load('client')
        ], 201);
    }

    // 3️⃣ View a single progress update
    public function show($id)
    {
        $update = ProjectProgressUpdate::with('client')->findOrFail($id);
        return response()->json($update);
    }

    // 4️⃣ Update an existing progress update
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'project' => 'sometimes|required|string|max:255',
            'client_name' => 'sometimes|required|string|exists:users,name',
            'progress' => 'sometimes|required|integer|min:0|max:100',
            'current_status' => 'sometimes|required|string|max:255',
            'completed_milestones' => 'nullable|string',
            'next_deadline' => 'nullable|date',
            'last_update' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $update = ProjectProgressUpdate::findOrFail($id);

        // If client_name is provided, update client_id
        if (isset($validated['client_name'])) {
            $client = User::where('name', $validated['client_name'])->first();
            $validated['client_id'] = $client->id;
            unset($validated['client_name']);
        }

        $update->update($validated);

        return response()->json([
            'message' => 'Progress update updated successfully',
            'data' => $update->load('client')
        ]);
    }

    // 5️⃣ Delete a progress update
    public function destroy($id)
    {
        $update = ProjectProgressUpdate::findOrFail($id);
        $update->delete();

        return response()->json(['message' => 'Progress update deleted successfully']);
    }
}

