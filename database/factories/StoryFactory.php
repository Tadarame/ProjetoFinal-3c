<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoryFactory extends Factory
{
    public function definition(): array
    {
        $images = glob(database_path('seeders/images/*'));

        $source = fake()->randomElement($images);
        $extension = pathinfo($source, PATHINFO_EXTENSION);
        $filename = Str::uuid() . '.' . $extension;
        $path = 'stories/' . $filename;

        Storage::disk('public')->put($path, file_get_contents($source));

        return [
            'image_path' => $path,
            'expires_at' => now()->addHours(24),
        ];
    }
}