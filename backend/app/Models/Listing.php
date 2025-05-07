<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    /** @use HasFactory<\Database\Factories\ListingFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'image',
        'price',
        'name',
        'location',
        'description',
        'categories',
        'condition',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // If the image path starts with http, return it as is (for picsum.photos URLs)
            if (strpos($this->image, 'http') === 0) {
                return $this->image;
            }
            
            // For storage images, ensure proper URL construction
            $imagePath = ltrim($this->image, '/');
            $baseUrl = rtrim(config('app.url'), '/');
            
            // Return the storage URL without checking file existence
            // This is more efficient and handles both storage and faker images
            return "{$baseUrl}/storage/{$imagePath}";
        }
        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
