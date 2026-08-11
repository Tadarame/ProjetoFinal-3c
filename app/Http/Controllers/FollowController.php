<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function toggle(Request $request, User $user, FollowService $followService)
    {
        $result = $followService->toggle($request->user(), $user);

        if ($result['error']) {
            return response()->json([
                'message' => $result['message'],
            ], $result['status']);
        }

        return response()->json([
            'following' => $result['following'],
            'followers_count' => $result['followers_count'],
        ]);
    }
}