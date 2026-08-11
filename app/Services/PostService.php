<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PostService
{
    public function create(User $user, array $data, UploadedFile $image): Post
    {
        $path = $image->store('posts', 'public');

        return Post::create([
            'user_id' => $user->id,
            'caption' => $data['caption'] ?? null,
            'image_path' => $path,
        ]);
    }

    public function update(User $user, Post $post, array $data): array
    {
        if ($user->id !== $post->user_id) {
            return [
                'error' => true,
                'message' => 'Não autorizado',
                'status' => 403,
            ];
        }

        $post->update($data);

        return [
            'error' => false,
            'post' => $post,
        ];
    }

    public function delete(User $user, Post $post): array
    {
        if ($user->id !== $post->user_id) {
            return [
                'error' => true,
                'message' => 'Não autorizado',
                'status' => 403,
            ];
        }

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return [
            'error' => false,
            'message' => 'Post apagado com sucesso',
        ];
    }
}