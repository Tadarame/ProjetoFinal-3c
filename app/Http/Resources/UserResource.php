<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        $authUser = $request -> user();
        return [
            'id' =>$this -> id,
            'name' =>$this -> name,
            'username' =>$this->username,
            'avatar' => $this->avatar,
            'posts_count' => $this->whenCounted('posts'),
            'followers_count' => $this->whenCounted('followers'),
            'following_count' => $this->whenCounted('following'),
            'is_following' => $authUser
                ? $authUser->following()->where('following_id', $this->id)->exists()
                : false,
        ];
    }
}
