<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'image_path',
        'is_primary'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            if (strpos($this->image_path, 'http') === 0) {
                return $this->image_path;
            }
            
            $imagePath = ltrim($this->image_path, '/');
            $baseUrl = rtrim(config('app.url'), '/');
            return "{$baseUrl}/storage/{$imagePath}";
        }
        return null;
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
} 