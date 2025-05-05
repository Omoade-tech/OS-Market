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
            'price' => $this->faker->randomFloat(2, 10, 10000),
            'name' => $this->faker->sentence(3),
            'location' => $this->faker->city,
            'description' => $this->faker->paragraph(3),
            'categories' => $this->faker->randomElement([
                'electronics',
                'fashion',
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
            ]),
            'condition' => $this->faker->randomElement(['new', 'used-good', 'used-like-new', 'used-fair']),
            // 'status' => 'pending',
            // 'rejection_reason' => null,
        ];
    }
}
