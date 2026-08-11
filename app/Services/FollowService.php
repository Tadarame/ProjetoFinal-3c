<?php

namespace App\Services;

use App\Models\User;

class FollowService
{
    public function toggle(User $authUser, User $user): array
    {
        if ($authUser->id === $user->id) {
            return [
                'error' => true,
                'message' => 'Você não pode seguir você mesmo',
                'status' => 422,
            ];
        }

        $isFollowing = $authUser->following()
            ->where('following_id', $user->id)
            ->exists();

        if ($isFollowing) {
            $authUser->following()->detach($user->id);
            $following = false;
        } else {
            $authUser->following()->attach($user->id);
            $following = true;
        }

        return [
            'error' => false,
            'following' => $following,
            'followers_count' => $user->followers()->count(),
        ];
    }
}