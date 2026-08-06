<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;

class likeController extends Controller
{
    public function toggle(Request $request, Post $post)
    {
        $userId = $request->user()->id;

        $like = Like::where('user_id', $userId)
        ->where('post_id', $post->id)
        ->first();

        if ($like) {
            $like->delete();
            return response()->json([
                'liked' => false,
                'likes_count' => $post->likes()->count(),
            ]);
        }

        Like::create([
            'user_id' => $userId,
            'post_id' => $post->id,
        ]);

        return response() ->json([
            'liked' => true,
            'likes_count' => $post->likes()->count(),
        ]);
    }
}
