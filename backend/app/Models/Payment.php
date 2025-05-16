<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'listing_id',
        'amount',
        'payment_method',
        'payment_status',
        'transaction_reference',
        'payment_details',
        'bank_reference',
        'card_details'
    ];

    protected $casts = [
        'payment_details' => 'array',
        'card_details' => 'encrypted:array'
    ];

    // Relationships
   

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', 'failed');
    }
} 