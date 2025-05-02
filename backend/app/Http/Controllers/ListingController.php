<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $listings = Listing::latest()->paginate($perPage);
            return response()->json([
                'success' => true, 
                'data' => $listings->items(),
                'pagination' => [
                    'current_page' => $listings->currentPage(),
                    'last_page' => $listings->lastPage(),
                    'per_page' => $listings->perPage(),
                    'total' => $listings->total(),
                    'from' => $listings->firstItem(),
                    'to' => $listings->lastItem(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch listings.'], 500);
        }
    }

    public function userListings($user_id)
    {
        try {
            $listings = Listing::where('user_id', $user_id)->latest()->get();
            return response()->json(['success' => true, 'data' => $listings], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch user listings.'], 500);
        }
    }

    public function show($id)
    {
        try {
            $listing = Listing::find($id);

            if (!$listing) {
                return response()->json(['success' => false, 'message' => 'Listing not found.'], 404);
            }

            return response()->json(['success' => true, 'data' => $listing], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error retrieving listing.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'nullable|image|mimes:jpg,jpeg,png',
                'price' => 'required|numeric',
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'categories' => 'required|string|max:255',
                'condition' => 'required|in:new,used-good,used-like-new,used-fair',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();
            $data['user_id'] = Auth::id();

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('listings', 'public');
                $data['image'] = str_replace('public/', '', $path);
            }

            $listing = Listing::create($data);

            return response()->json(['success' => true, 'message' => 'Listing created successfully.', 'data' => $listing], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to create listing.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $listing = Listing::find($id);

            if (!$listing) {
                return response()->json(['success' => false, 'message' => 'Listing not found.'], 404);
            }

            if ($listing->user_id !== Auth::id()) {
                return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
            }

            $validator = Validator::make($request->all(), [
                'image' => 'nullable|image|mimes:jpg,jpeg,png',
                'price' => 'required|numeric',
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'categories' => 'required|string|max:255',
                'condition' => 'required|in:new,used-good,used-like-new,used-fair',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('listings', 'public');
                $data['image'] = str_replace('public/', '', $path);
            }

            $listing->update($data);

            return response()->json(['success' => true, 'message' => 'Listing updated successfully.', 'data' => $listing], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update listing.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $listing = Listing::find($id);

            if (!$listing) {
                return response()->json(['success' => false, 'message' => 'Listing not found.'], 404);
            }

            if ($listing->user_id !== Auth::id()) {
                return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
            }

            $listing->delete();

            return response()->json(['success' => true, 'message' => 'Listing deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete listing.'], 500);
        }
    }

    /**
     * Search and filter listings by name, location, category, or condition.
     */
    public function search(Request $request)
    {
        try {
            $query = Listing::query();

            if ($request->filled('name')) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            if ($request->filled('location')) {
                $query->where('location', 'like', '%' . $request->location . '%');
            }

            if ($request->filled('categories')) {
                $query->where('categories', $request->categories);
            }

            if ($request->filled('condition')) {
                $query->where('condition', $request->condition);
            }

            $results = $query->latest()->paginate(10);

            return response()->json(['success' => true, 'data' => $results], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Search failed.'], 500);
        }
    }
}
