<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(), 
            'image' => $this->faker->imageUrl(640, 480, 'products', true),
            'price' => $this->faker->randomFloat(2, 100, 10000),
            'name' => $this->faker->words(3, true),
            'location' => $this->faker->city,
            'description' => $this->faker->paragraph,
            'categories' => $this->faker->word,
            'condition' => $this->faker->randomElement(['new', 'used-good', 'used-like-new', 'used-fair']),
        ];
    }
}
