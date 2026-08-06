<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class commentController extends Controller
{
    //get
    public function index(Post $post)
    {
        $comments = $post->comments()
        ->with('user')
        ->latest()
        ->get();

        return response()->json($comments);
    }

    //Post
    public function store(Request $request , Post $post)
    {
        $validate = $request->validate([
            'body' => 'required|string|max:500',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $post->id,
            'body' => $validate['body'],
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }

    public function update(Request $request, Comment $comment, Post $post)
    {
        $validate = $request->validate([
            'body' => 'required|string|max:500',
        ]);
        if ($request->user()->id !== $comment->user_id)
            {
                return response()->json(['message' => 'Não autorizado'], 403);
            }

        $comment -> update($validate);

        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request , Comment $comment)
    {
        if($request->user()->id !== $comment->user_id)
            {
                return response()->json(['message' => 'Não autorizado'], 403);
            }

            $comment->delete();

            return response()->json(['message' => "Comentario apagado com suscesso"]);
    }
}
