<?php

namespace App\Services;

use App\Models\Like;
use App\Models\Post;
use App\Models\User;

class LikeService
{
    public function toggle(User $user, Post $post): array
    {
        $like = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if ($like) {
            $like->delete();

            return [
                'liked' => false,
                'likes_count' => $post->likes()->count(),
            ];
        }

        Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        return [
            'liked' => true,
            'likes_count' => $post->likes()->count(),
        ];
    }
}