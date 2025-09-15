<?php

namespace App\Http\Controllers;

use App\Models\UserServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserServiceRequestController extends Controller
{
    public function index()
    {
        return UserServiceRequest::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        try {
            \Log::info('UserServiceRequest store method called', [
                'request_data' => $request->all(),
                'auth_user' => Auth::id(),
                'headers' => $request->headers->all()
            ]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'priority' => 'required|string',
                'category' => 'nullable|string',
                'projectRelated' => 'nullable|string',
                'urgency' => 'nullable|string',
                'expectedResolution' => 'nullable|string',
                'additionalNotes' => 'nullable|string',
                'feedback' => 'nullable|array'
            ]);
            $validated['user_id'] = Auth::id();
            $validated['status'] = 'Pending';
            $userserviceRequest = UserServiceRequest::create($validated);
            
            \Log::info('UserServiceRequest created successfully', ['request_id' => $userserviceRequest->id]);
            
            return response()->json([
                'message' => 'Service request submitted successfully',
                'data' => $userserviceRequest
            ], 201);
        } catch (\Exception $e) {
            \Log::error('UserServiceRequest store error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to submit service request',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(UserServiceRequest $userserviceRequest)
    {
        $this->authorize('view', $userserviceRequest);
        return $userserviceRequest;
    }

    public function update(Request $request, UserServiceRequest $userserviceRequest)
    {
        $this->authorize('update', $userserviceRequest);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|required|in:low,medium,high',
            'status' => 'nullable|string'
        ]);
        $userserviceRequest->update($validated);
        return response()->json($userserviceRequest);
    }

    public function destroy(UserServiceRequest $userserviceRequest)
    {
        $this->authorize('delete', $userserviceRequest);
        $userserviceRequest->delete();
        return response()->json(null, 204);
    }
}

