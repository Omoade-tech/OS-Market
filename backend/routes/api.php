<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Get authenticated user
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Profile routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    
    // Listing routes
    Route::get('/listings', [ListingController::class, 'index']);             
    Route::get('/listings/search', [ListingController::class, 'search']);     
    Route::get('/listings/filter-options', [ListingController::class, 'getFilterOptions']);     
    // Get listings by specific user
    Route::get('/listings/user/{user_id}', [ListingController::class, 'userListings']); 

    Route::post('/listings', [ListingController::class, 'store']);           
    Route::get('/listings/{id}', [ListingController::class, 'show']);       
    Route::put('/listings/{id}', [ListingController::class, 'update']);       
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']);   

    // Message routes
    Route::post('/messages/send', [MessageController::class, 'send']);
    Route::get('/messages/dashboard', [MessageController::class, 'dashboard']);
    Route::get('/messages/conversation/{userId}', [MessageController::class, 'conversation']);

    Route::get('/seller/listings', [ListingController::class, 'getSellerListings']);
});

// Admin routes
Route::prefix('admin')->middleware(['auth:sanctum', \App\Http\Middleware\AdminMiddleware::class])->group(function () {
    Route::get('/listings', [ListingController::class, 'getAllListings']);
    Route::get('/listings/stats', [ListingController::class, 'getListingStats']);
    Route::patch('/listings/{id}/status', [ListingController::class, 'updateListingStatus']);
});
