<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {   
        return [
            'id' => $this->id,
            'caption' => $this->caption,
            'image_url' => Storage::disk('public')->url($this->image_path),
            'user' => new UserResource($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'likes_count' => $this->whenLoaded('likes', fn () => $this->likes->count()),
            'liked' => $this->whenLoaded('likes', fn () => $request->user()
                ? $this->likes->contains('user_id', $request->user()->id)
                : false),
            'created_at' => $this->created_at,
        ];
    }
}
