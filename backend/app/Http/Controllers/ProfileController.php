<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's profile
     */
    public function show()
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            
            return response()->json([
                'success' => true,
                'message' => 'Profile retrieved successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'age' => $user->age,
                    'sex' => $user->sex,
                    'phoneNumber' => $user->phoneNumber,
                    'address' => $user->address,
                    'city' => $user->city,
                    'state' => $user->state,
                    'country' => $user->country,
                    'image' => $user->image ? Storage::url($user->image) : null,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request)
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            // Validate the request data
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => [
                    'sometimes',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'age' => 'sometimes|integer|min:1|max:120',
                'sex' => 'sometimes|in:male,female,other',
                'phoneNumber' => 'sometimes|string|max:20',
                'address' => 'sometimes|string|max:255',
                'city' => 'sometimes|string|max:100',
                'state' => 'sometimes|string|max:100',
                'country' => 'sometimes|string|max:100',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image && Storage::exists($user->image)) {
                    Storage::delete($user->image);
                }
                
                $path = $request->file('image')->store('profile_images', 'public');
                $validated['image'] = $path;
            }

            // Update user profile
            $user->fill($validated)->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'age' => $user->age,
                    'sex' => $user->sex,
                    'phoneNumber' => $user->phoneNumber,
                    'address' => $user->address,
                    'city' => $user->city,
                    'state' => $user->state,
                    'country' => $user->country,
                    'image' => $user->image ? Storage::url($user->image) : null,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 