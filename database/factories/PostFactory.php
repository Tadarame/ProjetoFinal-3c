<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $sourceImages = glob(database_path('seeders/images/*'));

        if (empty($sourceImages)) {
            return [
                'caption' => fake()->sentence(),
                'image_path' => null,
            ];
        }

        $sourceImage = fake()->randomElement($sourceImages);
        $extension = pathinfo($sourceImage, PATHINFO_EXTENSION);
        $filename = Str::uuid() . '.' . $extension;
        $destination = 'posts/' . $filename;

        Storage::disk('public')->put($destination, file_get_contents($sourceImage));

        return [
            'caption' => fake()->sentence(),
            'image_path' => $destination,
        ];
    }
}