<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
   // ✅ View profile
    public function show()
    {
        $user = Auth::user();
        return response()->json([
            'message' => 'User profile fetched successfully',
            'data' => $user
        ]);
    }

    // ✅ Update profile
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:Admin,Client',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/profile'), $filename);
            $validated['profile_picture'] = '/uploads/profile/' . $filename;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }
}


