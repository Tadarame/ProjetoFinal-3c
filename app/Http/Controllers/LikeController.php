<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\LikeService;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, Post $post, LikeService $likeService)
    {
        return response()->json(
            $likeService->toggle($request->user(), $post)
        );
    }
}