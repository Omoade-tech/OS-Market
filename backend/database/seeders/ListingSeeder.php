<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\User;

class ListingSeeder extends Seeder
{
    public function run(): void
    {
        // Only create listings for users with role = seller
        $sellers = User::where('role', 'seller')->get();

        foreach ($sellers as $seller) {
            Listing::factory()
                ->count(5) // 5 listings per seller
                ->create(['user_id' => $seller->id]);
        }
    }
}
