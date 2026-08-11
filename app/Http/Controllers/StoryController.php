<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StoryController extends Controller
{
    public function index()
    {
        $stories = Story::with('user')
            ->where('expires_at', '>', now())
            ->latest()
            ->get();

        return response()->json($stories->map(function ($story) {
            return [
                'id' => $story->id,
                'image_url' => Storage::disk('public')->url($story->image_path),
                'expires_at' => $story->expires_at,
                'user' => [
                    'id' => $story->user->id,
                    'name' => $story->user->name,
                    'username' => $story->user->username,
                ],
            ];
        }));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $path = $request->file('image')->store('stories', 'public');

        $story = Story::create([
            'user_id' => $request->user()->id,
            'image_path' => $path,
            'expires_at' => now()->addHours(24),
        ]);

        return response()->json($story, 201);
    }
}