<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Like;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory(10)->create();

        $users->each(function ($user) use ($users) {
            $posts = Post::factory(3)->create([
                'user_id' => $user->id,
            ]);

            $posts->each(function ($post) use ($users) {
                Comment::factory(5)->create([
                    'post_id' => $post->id,
                    'user_id' => $users->random()->id,
                ]);

                $users->random(3)->each(function ($user) use ($post) {
                    Like::firstOrCreate([
                        'user_id' => $user->id,
                        'post_id' => $post->id,
                    ]);
                });
            });

            $users
                ->where('id', '!=', $user->id)
                ->random(3)
                ->each(function ($followedUser) use ($user) {
                    $user->following()->syncWithoutDetaching($followedUser->id);
                });
        });
    }
}