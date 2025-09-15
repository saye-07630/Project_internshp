<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Return all users for admin dashboard
        $users = \App\Models\User::all();
        return response()->json($users, 200);
    }

    public function show($id)
    {
        $user = \App\Models\User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json($user, 200);
    }
}

