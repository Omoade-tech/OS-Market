<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('name');
            $table->string('location');
            $table->text('description');
            $table->enum('categories', [
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
            $table->enum('condition', ['new', 'used-good', 'used-like-new', 'used-fair']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
