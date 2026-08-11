<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{

    public function definition(): array
    {
        return [
            'caption' => fake()->sentence(),
            'image_path' => 'posts/default.jpg',
        ];
    }
}
