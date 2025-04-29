<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Schema;

class AuthController extends Controller
{
    public function register(Request $request) {
        try {
            // Validate the request data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8',
                'role' => 'nullable|in:admin,seller,buyer', 
            ]);

            // If no role is provided, set it to 'buyer'
            $role = $validated['role'] ?? 'buyer';

            // Create the user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $role, 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed.',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request) {
        try {
            // Validate the request data
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Attempt to authenticate the user
            if (Auth::attempt($validated)) {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                $token = $user->createToken('auth_token')->plainTextToken;
                
                return response()->json([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => $token,
                ], 200);
            }
            
            // If authentication fails
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request) {
        try {
            // Revoke the token that was used to authenticate the current request
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out',
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 