<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Registration Route
Route::post('/register', [AuthController::class, 'register']);

// Login Route
Route::post('/login', [AuthController::class, 'login']);

// Logout Route (authenticated users only)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Profile Routes (authenticated users only)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});
