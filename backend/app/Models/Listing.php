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
            // If the image path already starts with http, return it as is
            if (strpos($this->image, 'http') === 0) {
                return $this->image;
            }
            
            // Ensure the image path doesn't start with a slash
            $imagePath = ltrim($this->image, '/');
            
            // Get the base URL from config
            $baseUrl = rtrim(config('app.url'), '/');
            
            // Return the full URL
            return "{$baseUrl}/storage/{$imagePath}";
        }
        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
