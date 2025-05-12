<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'image',
        'age',
        'sex',
        'status',
        'phoneNumber',
        'address',
        'city',
        'state',
        'country',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->image) {
            // If the image path starts with http, return it as is
            if (strpos($this->image, 'http') === 0) {
                return $this->image;
            }
            
            // For storage images, ensure proper URL construction
            $imagePath = ltrim($this->image, '/');
            $baseUrl = rtrim(config('app.url'), '/');
            return "{$baseUrl}/storage/{$imagePath}";
        }
        return null;
    }

    /**
     * Get all listings posted by the user (typically a seller).
     */
    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get all messages sent by the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get all messages received by the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }
}
