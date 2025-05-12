<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $query = Listing::query()->with('user');

            // Filter by status if provided
            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            $listings = $query->latest()->paginate($perPage);
            
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
                'price' => 'nullable|numeric|min:0',
                'name' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'categories' => 'nullable|string|max:255',
                'condition' => 'nullable|in:new,used-good,used-like-new,used-fair',
            ]);

            if ($validator->fails()) {
            
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();
            

            // Only update fields that were provided
            $updateData = [];
            foreach ($data as $key => $value) {
                if ($value !== null && $value !== '') {
                    $updateData[$key] = $value;
                }
            }

            if ($request->hasFile('image')) {
            
                // Delete old image if it exists
                if ($listing->image && Storage::disk('public')->exists($listing->image)) {
                    Storage::disk('public')->delete($listing->image);
                }
                $path = $request->file('image')->store('listings', 'public');
                $updateData['image'] = str_replace('public/', '', $path);
        
            }

            // Update the listing with only the provided fields
            if (!empty($updateData)) {
                $listing->update($updateData);
                
            } 

            // Refresh the listing to get the latest data
            $listing->refresh();
            

            return response()->json([
                'success' => true,
                'message' => 'Listing updated successfully.',
                'data' => [
                    'id' => $listing->id,
                    'name' => $listing->name,
                    'description' => $listing->description,
                    'price' => $listing->price,
                    'image' => $listing->image ? '/storage/' . $listing->image : null,
                    'categories' => $listing->categories,
                    'condition' => $listing->condition,
                    'status' => $listing->status,
                    'location' => $listing->location,
                    'created_at' => $listing->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $listing->updated_at->format('Y-m-d H:i:s')
                ]
            ], 200);
        } catch (\Exception $e) {
        
            return response()->json([
                'success' => false, 
                'message' => 'Failed to update listing.', 
                'error' => $e->getMessage()
            ], 500);
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
            
            $query = Listing::query()->with('user');

            // Search by name
            if ($request->filled('name')) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            }

            // Search by location
            if ($request->filled('location')) {
                $query->where('location', 'like', '%' . $request->input('location') . '%');
            }

            // Filter by category
            if ($request->filled('categories')) {
                $query->where('categories', $request->input('categories'));
            }

            // Filter by condition
            if ($request->filled('condition')) {
                $query->where('condition', $request->input('condition'));
            }

            // Get pagination parameters
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            // Get results with pagination
            $results = $query->latest()->paginate($perPage);

            // Transform the data to include user information
            $transformedData = collect($results->items())->map(function ($listing) {
                return [
                    'id' => $listing->id,
                    'name' => $listing->name,
                    'price' => $listing->price,
                    'location' => $listing->location,
                    'description' => $listing->description,
                    'categories' => $listing->categories,
                    'condition' => $listing->condition,
                    'image' => $listing->image,
                    'image_url' => $listing->image_url,
                    'created_at' => $listing->created_at,
                    'user' => $listing->user ? [
                        'id' => $listing->user->id,
                        'name' => $listing->user->name,
                    ] : null,
                ];
            })->all();

            return response()->json([
                'success' => true, 
                'data' => $transformedData,
                'pagination' => [
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                    'per_page' => $results->perPage(),
                    'total' => $results->total(),
                    'from' => $results->firstItem(),
                    'to' => $results->lastItem(),
                ],
                'filters' => [
                    'name' => $request->input('name'),
                    'location' => $request->input('location'),
                    'categories' => $request->input('categories'),
                    'condition' => $request->input('condition'),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Search failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get filter options for categories and conditions
     */
    public function getFilterOptions()
    {
        try {
            $categories = [
                'electronics',
                'fashion',
                'phones-gadgets',
                'home-garden',
                'vehicles',
                'real-estate',
                'jobs',
                'services',
                'education',
                'health-beauty',
                'sports-fitness',
                'pets',
                'food-drinks',
                'art-collectibles',
                'books-music-movies',
                'business-equipment'
            ];

            $conditions = [
                'new',
                'used-good',
                'used-like-new',
                'used-fair'
            ];

          

            return response()->json([
                'success' => true,
                'data' => [
                    'categories' => $categories,
                    'conditions' => $conditions,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch filter options.'], 500);
        }
    }

    public function getSellerListings(Request $request)
    {
        try {
            $user = $request->user();
            
            $listings = Listing::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($listing) {
                    return [
                        'id' => $listing->id,
                        'name' => $listing->name,
                        'description' => $listing->description,
                        'price' => $listing->price,
                        'image' => $listing->image,
                        'image_url' => $listing->image_url,
                        'categories' => $listing->categories,
                        'condition' => $listing->condition,
                        'status' => $listing->status,
                        'location' => $listing->location,
                        'created_at' => $listing->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $listing->updated_at->format('Y-m-d H:i:s')
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $listings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch listings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update listing status (Admin only)
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateListingStatus(Request $request, $id)
    {
        try {
            // Check if user is admin
            if (!Auth::check() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only admins can update listing status.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:approved,rejected,pending'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $listing = Listing::find($id);

            if (!$listing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Listing not found.'
                ], 404);
            }

            $listing->status = $request->status;
            $listing->save();

            return response()->json([
                'success' => true,
                'message' => 'Listing status updated successfully.',
                'data' => [
                    'id' => $listing->id,
                    'name' => $listing->name,
                    'description' => $listing->description,
                    'price' => $listing->price,
                    'image' => $listing->image,
                    'image_url' => $listing->image_url,
                    'categories' => $listing->categories,
                    'condition' => $listing->condition,
                    'status' => $listing->status,
                    'location' => $listing->location,
                    'user_id' => $listing->user_id,
                    'created_at' => $listing->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $listing->updated_at->format('Y-m-d H:i:s')
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update listing status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get listing statistics for admin dashboard
     */
    public function getListingStats()
    {
        try {
            // Check if user is admin
            if (!Auth::check() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only admins can access listing statistics.'
                ], 403);
            }

            $stats = [
                'total' => Listing::count(),
                'pending' => Listing::where('status', 'pending')->count(),
                'approved' => Listing::where('status', 'approved')->count(),
                'rejected' => Listing::where('status', 'rejected')->count(),
                'recent_listings' => Listing::with('user')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($listing) {
                        return [
                            'id' => $listing->id,
                            'name' => $listing->name,
                            'price' => $listing->price,
                            'status' => $listing->status,
                            'created_at' => $listing->created_at->format('Y-m-d H:i:s'),
                            'user' => [
                                'id' => $listing->user->id,
                                'name' => $listing->user->name,
                                'email' => $listing->user->email
                            ]
                        ];
                    })
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch listing statistics.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all listings for admin dashboard
     */
    public function getAllListings(Request $request)
    {
        try {
            // Check if user is admin
            if (!Auth::check() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only admins can access all listings.'
                ], 403);
            }

            $perPage = $request->input('per_page', 10);
            $listings = Listing::with('user')
                ->latest()
                ->paginate($perPage);

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
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch listings.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}