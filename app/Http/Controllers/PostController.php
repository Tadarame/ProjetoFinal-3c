<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\PostResource;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Services\PostService;

class PostController extends Controller
{
  //GET  
  //eager loading
    public function index()
    {
        $posts = Post::with(['user', 'comments.user', 'likes'])
        ->latest()
        ->paginate(10);

        return PostResource::collection($posts);
    }


    //Post
    public function store(StorePostRequest $request, PostService $postService)
    {
        $post = $postService->create(
            $request->user(),
            $request->validated(),
            $request->file('image')
        );

        return new PostResource($post);
    }   

    //GET POST
    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'likes']);
        return new PostResource($post);
    }

    //Put?patch
    public function update(UpdatePostRequest $request, Post $post, PostService $postService)
    {
        $result = $postService->update($request->user(), $post, $request->validated());

        if ($result['error']) {
            return response()->json(['message' => $result['message']], $result['status']);
        }

        return new PostResource($result['post']);
    }
    //delete
    public function destroy(Request $request,Post $post, PostService $postService)
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
