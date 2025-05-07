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
            // If the image path already starts with http, return it as is (for faker images)
            if (strpos($this->image, 'http') === 0) {
                return $this->image;
            }
            
            // For storage images, ensure proper URL construction
            $imagePath = ltrim($this->image, '/');
            $baseUrl = rtrim(config('app.url'), '/');
            
            // Check if the image exists in storage
            if (file_exists(storage_path('app/public/' . $imagePath))) {
                return "{$baseUrl}/storage/{$imagePath}";
            }
            
            // If image doesn't exist in storage, return null
            return null;
        }
        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
