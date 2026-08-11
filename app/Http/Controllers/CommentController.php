<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Services\CommentService;
use Illuminate\Http\Request;

class CommentController extends Controller
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
    public function store(Request $request, Post $post, CommentService $commentService)
{
    $validated = $request->validate([
        'body' => 'required|string|max:500',
    ]);

    $comment = $commentService->create($request->user(), $post, $validated);

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

    public function destroy(Request $request, Comment $comment, CommentService $commentService)
{
    $result = $commentService->delete($request->user(), $comment);

    if ($result['error']) {
        return response()->json(['message' => $result['message']], $result['status']);
    }

    return response()->json(['message' => $result['message']]);
}
}
