<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Get all posts
    public function index()
    {
        $posts = Blog::orderBy('created_at', 'desc')->get();
        
        // Transform the data to include excerpt and other frontend-expected fields
        $transformedPosts = $posts->map(function($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'author' => $post->author,
                'category' => $post->category,
                'status' => $post->status,
                'image_url' => $post->image_url,
                'content' => $post->content,
                'excerpt' => $this->generateExcerpt($post->content),
                'views' => $post->views,
                'likes' => $post->likes,
                'publish_date' => $post->publish_date,
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
                // Additional fields for frontend compatibility
                'featured' => false, // You can add this field to the database if needed
                'tags' => [], // You can add this field to the database if needed
            ];
        });
        
        return response()->json($transformedPosts);
    }

    // Store new blog post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'author'       => 'required|string|max:255',
            'category'     => 'required|string|max:255',
            'status'       => 'required|in:Draft,Published,Review',
            'image_url'    => 'nullable|url',
            'content'      => 'required|string',
            'publish_date' => 'nullable|date',
        ]);

        $post = Blog::create($validated);

        return response()->json([
            'message' => 'Post created successfully',
            'data'    => $post,
        ], 201);
    }

    // Show single post
    public function show($id)
    {
        $post = Blog::findOrFail($id);
        return response()->json($post);
    }

    // Update post
    public function update(Request $request, $id)
    {
        $post = Blog::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'author'       => 'sometimes|string|max:255',
            'category'     => 'sometimes|string|max:255',
            'status'       => 'sometimes|in:Draft,Published,Review',
            'image_url'    => 'nullable|url',
            'content'      => 'sometimes|string',
            'publish_date' => 'nullable|date',
        ]);

        $post->update($validated);

        return response()->json([
            'message' => 'Post updated successfully',
            'data'    => $post,
        ]);
    }

    // Delete post
    public function destroy($id)
    {
        $post = Blog::findOrFail($id);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    // Increment views
    public function incrementViews($id)
    {
        $post = Blog::findOrFail($id);
        $post->increment('views');
        return response()->json(['message' => 'View added']);
    }

    // Increment likes (only once per user)
    public function incrementLikes($id)
    {
        $user = Auth::user(); // make sure user is authenticated
        $post = Blog::findOrFail($id);

        // Check if user already liked
        if ($post->likedByUsers()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You already liked this post'], 400);
        }

        $post->likedByUsers()->attach($user->id);
        $post->increment('likes');

        return response()->json(['message' => 'Like added']);
    }

    private function generateExcerpt($content, $length = 150)
    {
        // Remove HTML tags and get plain text
        $text = strip_tags($content);
        
        // If text is shorter than desired length, return as is
        if (strlen($text) <= $length) {
            return $text;
        }
        
        // Truncate and add ellipsis
        return substr($text, 0, $length) . '...';
    }
}