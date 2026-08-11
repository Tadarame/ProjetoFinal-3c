<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

class CommentService
{
    public function create(User $user, Post $post, array $data): Comment
    {
        $comment = Comment::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
            'body' => $data['body'],
        ]);

        return $comment->load('user');
    }

    public function delete(User $user, Comment $comment): array
    {
        if ($user->id !== $comment->user_id) {
            return [
                'error' => true,
                'message' => 'Não autorizado',
                'status' => 403,
            ];
        }

        $comment->delete();

        return [
            'error' => false,
            'message' => 'Comentário apagado com sucesso',
        ];
    }
}