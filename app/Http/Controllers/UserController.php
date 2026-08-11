<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // GET /api/users/{user} -> perfil de qualquer usuário (ou o próprio)
    public function show(Request $request, User $user)
    {
        $user->loadCount(['posts', 'followers', 'following']);

        return response()->json([
            'user'  => new UserResource($user),
            'posts' => PostResource::collection(
                $user->posts()->with(['user', 'comments', 'likes'])->latest()->get()
            ),
        ]);
    }

    // PUT /api/profile -> editar o próprio perfil
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'bio'      => 'nullable|string|max:150',
            'avatar'   => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($validated);

        return new UserResource($user);
    }

    // GET /api/search?q=termo -> busca usuários
    public function search(Request $request)
    {
        $query = $request->query('q');

        $users = User::when($query, function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('username', 'like', "%{$query}%");
            })
            ->withCount(['posts', 'followers', 'following'])
            ->paginate(20);

        return UserResource::collection($users);
    }
}