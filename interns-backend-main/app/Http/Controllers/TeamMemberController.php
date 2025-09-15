<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeamMemberController extends Controller
{
    // ✅ List all team members
    public function index()
    {
        return response()->json(TeamMember::all());
    }

    // ✅ Create new team member
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:team_members',
            'password'   => 'required|min:6',
            'role'       => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'status'     => 'required|in:Active,Inactive',
            'phone'      => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $member = TeamMember::create($validated);

        return response()->json($member, 201);
    }

    // ✅ Show single team member
    public function show($id)
    {
        $member = TeamMember::findOrFail($id);
        return response()->json($member);
    }

    // ✅ Update team member
    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:team_members,email,' . $id,
            'password'   => 'sometimes|min:6',
            'role'       => 'sometimes|string|max:255',
            'department' => 'sometimes|string|max:255',
            'status'     => 'sometimes|in:Active,Inactive',
            'phone'      => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $member->update($validated);

        return response()->json($member);
    }

    // ✅ Delete team member
    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);
        $member->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    // ✅ Bulk update
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids'    => 'required|array',
            'ids.*'  => 'exists:team_members,id',
            'role'   => 'nullable|string|max:255',
            'status' => 'nullable|in:Active,Inactive',
        ]);

        $updates = [];
        if (!empty($validated['role'])) {
            $updates['role'] = $validated['role'];
        }
        if (!empty($validated['status'])) {
            $updates['status'] = $validated['status'];
        }

        if (empty($updates)) {
            return response()->json(['message' => 'No changes applied'], 400);
        }

        TeamMember::whereIn('id', $validated['ids'])->update($updates);

        return response()->json(['message' => 'Bulk update applied successfully']);
    }
// ✅ Bulk delete
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:team_members,id',
        ]);

        TeamMember::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'message' => 'Selected team members deleted successfully',
            'deleted_ids' => $validated['ids'],
        ]);
    }

    // ✅ Stats
    public function stats()
    {
        $total = TeamMember::count();
        $active = TeamMember::where('status', 'Active')->count();
        $avgPerformance = TeamMember::avg('performance_score');
        
        return response()->json([
            'total_members' => $total,
            'active_members' => $active,
            'average_performance' => round($avgPerformance, 2),
        ]);
    }
}
