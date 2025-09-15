<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserServiceRequest;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Get service requests with user information
            $serviceRequests = UserServiceRequest::with('user')->get();
            
            $result = $serviceRequests->map(function($req) {
                return [
                    'id' => $req->id,
                    'title' => $req->title,
                    'description' => $req->description,
                    'priority' => $req->priority,
                    'status' => $req->status,
                    'user_id' => $req->user_id,
                    'client_name' => $req->user ? $req->user->name : 'Unknown User',
                    'client_email' => $req->user ? $req->user->email : 'unknown@example.com',
                    'submitted_date' => $req->created_at,
                    'created_at' => $req->created_at,
                    'updated_at' => $req->updated_at,
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
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

