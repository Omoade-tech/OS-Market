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
        $name = $this->faker->sentence(3);
        $category = $this->faker->randomElement([
            'electronics',
            'fashion',
            'phones-gadgets',
            'home-garden',
            'vehicles',
            'real-estate',
            'jobs',
            'services',
            'education',
            'health-beauty',
            'sports-fitness',
            'pets',
            'food-drinks',
            'art-collectibles',
            'books-music-movies',
            'business-equipment'
        ]);

        return [
            'user_id' => User::factory(), 
            'image' => 'https://picsum.photos/seed/' . urlencode($name) . '/640/480',
            'price' => $this->faker->randomFloat(2, 10, 10000),
            'name' => $name,
            'location' => $this->faker->city,
            'description' => $this->faker->paragraph(3),
            'categories' => $category,
            'condition' => $this->faker->randomElement(['new', 'used-good', 'used-like-new', 'used-fair']),
            // 'status' => 'pending',
            // 'rejection_reason' => null,
        ];
    }
}
