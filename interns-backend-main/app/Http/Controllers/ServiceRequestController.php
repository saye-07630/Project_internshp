<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserServiceRequest;
use App\Models\User;

class ServiceRequestController extends Controller
{
    
    public function index(Request $request)
    {
        $query = UserServiceRequest::with('user');

        if ($request->has('client_name')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->client_name.'%');
            });
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // View single service request
    public function show($id)
    {
        return response()->json(UserServiceRequest::with('user')->findOrFail($id));
    }

    // Delete service request
    public function destroy($id)
    {
        $service = UserServiceRequest::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service request deleted successfully']);
    }
}