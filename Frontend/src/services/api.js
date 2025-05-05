import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

// Ensure auth token exists before secure requests
function ensureToken() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token is missing');
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default {
    // Auth: Login
    async login(credentials) {
        try {
            const response = await apiClient.post('/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                return response.data;
            }
            throw new Error('Login failed: Invalid response format');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Auth: Register
    async register(userData) {
        try {
            const response = await apiClient.post('/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    // Auth: Logout
    async logout() {
        try {
            const response = await apiClient.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete apiClient.defaults.headers.common['Authorization'];
            return response.data;
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            ensureToken();
            const response = await apiClient.get('/user');
            return response.data;
        } catch (error) {
            console.error('Failed to get current user:', error);
            throw error;
        }
    },

    // Profile: Get User Profile
    async getUserProfile() {
        try {
            ensureToken();
            const response = await apiClient.get('/profile');
            return response.data.data; // Return the user data directly
        } catch (error) {
            console.error('Failed to get profile:', error);
            throw error;
        }
    },

    // Profile: Update User Profile
    async updateUserProfile(profileData) {
        try {
            ensureToken();
            console.log('API: Raw profile data:', profileData);
            console.log('API: Image type:', profileData.image?.type);
            console.log('API: Image instanceof File:', profileData.image instanceof File);
            console.log('API: Image instanceof Blob:', profileData.image instanceof Blob);

            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            };

            // If we have an image, use FormData
            if (profileData.image instanceof File) {
                const formData = new FormData();
                
                // Add image with proper file type and name
                formData.append('image', profileData.image, profileData.image.name);
                
                // Add all other fields to FormData
                const fieldsToExclude = ['id', 'role', 'created_at', 'updated_at'];
                Object.keys(profileData).forEach(key => {
                    if (!fieldsToExclude.includes(key) && profileData[key] !== null && profileData[key] !== undefined) {
                        // Ensure name and email are always included
                        if (key === 'name' || key === 'email') {
                            formData.append(key, profileData[key] || '');
                        } else if (key !== 'image') {
                            formData.append(key, profileData[key]);
                        }
                    }
                });

                // Log FormData contents for debugging
                for (let pair of formData.entries()) {
                    console.log('FormData entry:', pair[0], pair[1]);
                }

                // Set the correct headers for file upload
                config.headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                };

                console.log('API: Sending request with FormData');
                const response = await apiClient.put('/profile', formData, config);
                console.log('API: Profile update response:', response.data);
                return response.data;
            } else {
                // If no image, send as JSON
                console.log('API: Sending request with JSON data');
                const response = await apiClient.put('/profile', profileData, config);
                console.log('API: Profile update response:', response.data);
                return response.data;
            }
        } catch (error) {
            console.error('API: Profile update error:', error.response?.data || error.message);
            if (error.response?.data?.errors) {
                // Handle validation errors
                const errorMessages = Object.entries(error.response.data.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                throw new Error(errorMessages);
            }
            throw error;
        }
    },

    // Listings: Get all listings
    async getListings(page = 1) {
        try {
            ensureToken();
            const response = await apiClient.get('/listings', {
                params: {
                    page: page,
                    per_page: 10
                }
            });
            if (response.data && response.data.success) {
                return response.data;
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Failed to fetch listings:', error);
            throw error;
        }
    },

    // Listings: Search listings
    async searchListings(filters) {
        try {
            ensureToken();
            // Convert filters to query parameters
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    params.append(key, value);
                }
            });

            const response = await apiClient.get('/listings/search', { 
                params: params
            });
            
            if (response.data && response.data.success) {
                return response.data;
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Failed to search listings:', error);
            throw error;
        }
    },

    // Listings: Get filter options
    async getFilterOptions() {
        try {
            ensureToken();
            const response = await apiClient.get('/listings/filter-options');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch filter options:', error);
            throw error;
        }
    },

    // Listings: Get user's listings
    async getUserListings(userId) {
        try {
            ensureToken();
            const response = await apiClient.get(`/listings/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user listings:', error);
            throw error;
        }
    },

    // Listings: Get single listing
    async getListingById(id) {
        try {
            ensureToken();
            const response = await apiClient.get(`/listings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch listing:', error);
            throw error;
        }
    },

    // Listings: Create new listing
    async createListing(listingData) {
        try {
            ensureToken();
            const formData = new FormData();
            
            // Handle images if they exist
            if (listingData.images) {
                listingData.images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            }

            // Add other listing data
            Object.keys(listingData).forEach(key => {
                if (key !== 'images' && listingData[key] !== null) {
                    formData.append(key, listingData[key]);
                }
            });

            const response = await apiClient.post('/listings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create listing:', error);
            throw error;
        }
    },

    // Listings: Update listing
    async updateListing(id, listingData) {
        try {
            ensureToken();
            const formData = new FormData();
            
            // Handle images if they exist
            if (listingData.images) {
                listingData.images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            }

            // Add other listing data
            Object.keys(listingData).forEach(key => {
                if (key !== 'images' && listingData[key] !== null) {
                    formData.append(key, listingData[key]);
                }
            });

            const response = await apiClient.put(`/listings/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update listing:', error);
            throw error;
        }
    },

    // Listings: Delete listing
    async deleteListing(id) {
        try {
            ensureToken();
            const response = await apiClient.delete(`/listings/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete listing:', error);
            throw error;
        }
    },

    // Get listing details
    async getListingDetails(id) {
        try {
            const response = await apiClient.get(`/listings/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    // Send message to seller
    async sendMessage(messageData) {
        try {
            ensureToken();
            const response = await apiClient.post('/messages/send', {
                receiver_id: messageData.seller_id,
                message: messageData.message
            });
            return response.data;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }
};