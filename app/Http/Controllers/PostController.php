<?php

namespace App\Http\Controllers;

use App\Models\post;
use Illuminate\Http\Request;

class PostController extends Controller
{
  //GET  
  //eager loading
    public function index()
    {
        $posts = Post::with(['user', 'comments', 'likes'])
        ->latest()
        ->paginate(10);

        return response() ->json($posts);
    }


    //Post
    public function store(Request $request)
    {
        $validate = $request->validate([
            'caption' => 'nullable|string|max:2200',
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('posts', 'public');

        $post = Post::create([
            'user_id' =>$request->user()->id,
            'caption' => $validate['caption'] ?? null,
            'image_path' => $path,
        ]);

        return response()->json($post,201);
    }

    //GET POST
    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'likes']);
        return response()->json($post);
    }
    //Put?patch
    public function update(Request $request, Post $post)
    {
        if($request->user()->id !== $post->user_id){
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $validate = $request->validate([
            'caption' => 'nullable|string|max:2200',
        ]);

        $post->update($validate);

        return response()->json($post);
    }


    //delete
    public function destroy(Request $request,Post $post)
    {
        if($request->user()->id !== $post->user_id){
            return response()->json(['message' => 'Não autorizado'], 403);
        }
        if ($post->image_path)
            {
                Storage:disk('public')->delete($post->iamge_path);
            }
        $post ->delete();

        return response()->json(['message' => 'Post apagado com suscesso']);
    }
}
