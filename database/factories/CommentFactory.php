<?php

namespace Database\Factories;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{

    public function definition(): array
    {
        return [
            'body' => fake()->randomElement([
                'Muito bom!',
                'Que foto legal!',
                'Gostei demais',
                'Top!',
                'Ficou incrível',
                'Boa!',
            ]),
        ];
    }
}
