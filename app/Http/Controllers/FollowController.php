<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class FollowController extends Controller
{
    public function toggle(Request $request, User $user)
    {
        $authUser = $request->user();

        if ($authUser->id === $user->id){
            return response()->json(['message' => 'voce nao pode seguir voce mesmo '], 422);
        }

        $isFollowing = $authUser->following()->where('following_id', $user->id)->exists();

        if ($isFollowing){
            $authUser->following()->detach($user->id);
            $following = false;
        } else {
            $authUser->following()->attach($user->id);
            $following = true;
        }

        return response()->json([
            'following' => $following,
            'followers_count' => $user->followers()->count(),
        ]);
    }
}
