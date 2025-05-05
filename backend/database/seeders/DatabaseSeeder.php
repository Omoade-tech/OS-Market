<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Create sellers and buyers
        User::factory(5)->create(['role' => 'seller']);
        User::factory(5)->create(['role' => 'buyer']);

        
        $this->call([
            ListingSeeder::class,
        ]);
    }
}
