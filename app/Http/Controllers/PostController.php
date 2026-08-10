<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PostResource;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;

class PostController extends Controller
{
  //GET  
  //eager loading
    public function index()
    {
        $posts = Post::with(['user', 'comments', 'likes'])
        ->latest()
        ->paginate(10);

        return PostResource::collection($posts);
    }


    //Post
    public function store(StorePostRequest $request)
    {
        $path = $request->file('image')->store('posts', 'public');


        $post = Post::create([
            'user_id' =>$request->user()->id,
            'caption' => $request->validated('caption'),
            'image_path' => $path,
        ]);

        return new PostResource($post);
    }

    //GET POST
    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'likes']);
        return new PostResource($post);
    }
    //Put?patch
    public function update(UpdatePostRequest $request, Post $post)
    {
        if($request->user()->id !== $post->user_id){
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $post->update($request->validated());

        return new PostResource($post);

    }
    //delete
    public function destroy(Request $request,Post $post)
    {
        if($request->user()->id !== $post->user_id){
            return response()->json(['message' => 'Não autorizado'], 403);
        }
        if ($post->image_path)
            {
                Storage::disk('public')->delete($post->image_path);
            }
        $post ->delete();

        return response()->json(['message' => 'Post apagado com suscesso']);
    }
}
