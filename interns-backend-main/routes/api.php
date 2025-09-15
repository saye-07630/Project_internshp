<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Api\UserController as ApiUserController;   // ✅ only one alias
use App\Http\Controllers\UserProjectController;
use App\Http\Controllers\UserServiceRequestController;
use App\Http\Controllers\UserMessageController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\Api\OverviewController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Api\ServiceRequestController;
use App\Http\Controllers\Api\ProjectProgressController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by RouteServiceProvider and assigned to "api".
| They return JSON responses for the React frontend.
|--------------------------------------------------------------------------
*/

// Test route for authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ================== AUTH ROUTES ==================

// Registration
Route::post('/register', [RegisteredUserController::class, 'store']);

// Login
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Logout (requires authentication)
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

// Forgot password (send reset link)
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

// Reset password
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Email verification (optional)
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:6,1']);

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth:sanctum', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

// ================== PUBLIC CONTENT ROUTES ==================

Route::get('/home', function () {
    return response()->json([
        'title' => 'Welcome to Hawi Software Solutions',
        'message' => 'We build modern software solutions.'
    ]);
});

Route::get('/about', function () {
    return response()->json([
        'company' => 'Hawi Software Solutions',
        'values' => 'Innovation, Quality, and Customer Satisfaction'
    ]);
});

Route::get('/services', function () {
    return response()->json([
        ['name' => 'Web Development', 'description' => 'Modern web apps using Laravel + React'],
        ['name' => 'Mobile Apps', 'description' => 'Cross-platform mobile solutions'],
        ['name' => 'Cloud Solutions', 'description' => 'Secure and scalable cloud services']
    ]);
});

Route::get('/contact', function () {
    return response()->json([
        'email' => 'contact@hawisoftware.com',
        'phone' => '+251 912 345 678',
        'address' => 'Addis Ababa, Ethiopia'
    ]);
});

Route::get('/blog', [BlogController::class, 'index']);

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json(['message' => 'API is working', 'timestamp' => now()]);
});

// Debug route for message testing
Route::post('/debug/message', function (Request $request) {
    return response()->json([
        'received_data' => $request->all(),
        'headers' => $request->headers->all(),
        'method' => $request->method(),
        'content_type' => $request->header('Content-Type')
    ]);
});

// ================== USER ROUTES (secured) ==================
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user', [ApiUserController::class, 'index']);
    Route::get('/user/{id}', [ApiUserController::class, 'show']);
    Route::put('/user', [ApiUserController::class, 'update']);

    // Projects (user-specific)
    Route::apiResource('userprojects', UserProjectController::class)->only(['index', 'show', 'store']);

    // Service Requests (user-specific)
    Route::apiResource('user_service-requests', UserServiceRequestController::class);

    // Messages (user-specific)
    Route::apiResource('usermessages', UserMessageController::class);
});

// Feedback
Route::get('/rating', [RatingController::class, 'index']);
Route::post('/rating', [RatingController::class, 'store']);

// ================== ADMIN ROUTES ==================

// Overview
Route::get('/overview', [OverviewController::class, 'index']);

// User Management (temporarily public for testing)
Route::apiResource('users', ApiUserController::class);   // ✅ now using alias

// Team Members
Route::apiResource('team-members', TeamMemberController::class);
Route::post('team-members/bulk-update', [TeamMemberController::class, 'bulkUpdate']);
Route::post('team-members/bulk-delete', [TeamMemberController::class, 'bulkDelete']);
Route::get('team-members/stats', [TeamMemberController::class, 'stats']);

// Project Progress Updates (temporarily public for testing)
Route::apiResource('progress-updates', ProjectProgressController::class);

// Project Requests
Route::prefix('admin/projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::get('/{id}', [ProjectController::class, 'show']);
    Route::delete('/{id}', [ProjectController::class, 'destroy']);
});

// Service Requests
Route::prefix('admin/services')->group(function () {
    Route::get('/', [ServiceRequestController::class, 'index']);
    Route::get('/{id}', [ServiceRequestController::class, 'show']);
    Route::delete('/{id}', [ServiceRequestController::class, 'destroy']);
});

// Messages (temporarily public for testing)
Route::prefix('admin/messages')->group(function () {
    Route::get('/', [MessageController::class, 'index']);          
    Route::post('/', [MessageController::class, 'store']);         
    Route::patch('/{id}/read', [MessageController::class, 'markAsRead']); 
    Route::post('/{id}/reply', [MessageController::class, 'reply']);      
    Route::delete('/{id}', [MessageController::class, 'destroy']); 
});

// Blogs
Route::apiResource('blog', BlogController::class);
Route::post('blog/{id}/increment-views', [BlogController::class, 'incrementViews']);
Route::post('blog/{id}/increment-likes', [BlogController::class, 'incrementLikes'])->middleware('auth:sanctum');

// User Profile
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);      
    Route::post('/profile', [ProfileController::class, 'update']);   
});

// Notifications
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
});

// Admin notification creation (for creating notifications for users)
Route::post('/notifications', [NotificationController::class, 'create']);

// Admin notifications
Route::get('/admin/notifications', [NotificationController::class, 'adminIndex']);
