<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;


class ProfileController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user()
            ->loadcount(['posts', 'followers', 'following'])
            ->load(['posts' => fn ($query) => $query->latest()]);

            return new UserResource($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string' , 'max:255'],
            'username' => ['required', 'string', 'max:255',
            Rule::unique('users', 'username')->ignore($user->id),
            ],
            'bio' => ['nullable', 'string', 'max:500'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        if($request->hasFile('avatar')){
            $validated['avatar'] = $request->file('avatar')->sotre('avatars','public');
        }

        $user->update($validated);

        return new UserResource($user->loadCount(['posts', 'followers', 'following']));
    }
}
