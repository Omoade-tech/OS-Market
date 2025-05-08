import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
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
    // Admin endpoints
    admin: {
        // Get admin dashboard statistics
        async getStats() {
            try {
                ensureToken();
                console.log('Making request to:', `${API_URL}/admin/listings/stats`);
                const response = await apiClient.get('/admin/listings/stats');
                console.log('Response:', response);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
                if (error.response) {
                    console.error('Error response:', {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers
                    });
                }
                throw error;
            }
        },

        // Get all listings for admin
        async getAllListings(page = 1) {
            try {
                const response = await apiClient.get('/admin/listings', {
                    params: { page, per_page: 10 }
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch all listings:', error);
                throw error;
            }
        },

        // Update listing status
        async updateListingStatus(listingId, status) {
            try {
                const response = await apiClient.patch(`/admin/listings/${listingId}/status`, { status });
                return response.data;
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to update listing status');
            }
        },

        // Get listing details
        async getListingDetails(listingId) {
            try {
                const response = await apiClient.get(`/admin/listings/${listingId}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch listing details:', error);
                throw error;
            }
        }
    },

    // Auth endpoints
    auth: {
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

        async register(userData) {
            try {
                const response = await apiClient.post('/register', userData);
                return response.data;
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        },

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

        async getCurrentUser() {
            try {
                const response = await apiClient.get('/user');
                return response.data;
            } catch (error) {
                console.error('Failed to get current user:', error);
                throw error;
            }
        }
    },

    // Listing endpoints
    listings: {
        async getAll(page = 1) {
            try {
                const response = await apiClient.get('/listings', {
                    params: { page, per_page: 10 }
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch listings:', error);
                throw error;
            }
        },

        async getById(id) {
            try {
                const response = await apiClient.get(`/listings/${id}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch listing:', error);
                throw error;
            }
        },

        async create(listingData) {
            try {
                const response = await apiClient.post('/listings', listingData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Failed to create listing:', error);
                throw error;
            }
        },

        async update(id, listingData) {
            try {
                const response = await apiClient.post(`/listings/${id}`, listingData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Failed to update listing:', error);
                throw error;
            }
        },

        async delete(id) {
            try {
                const response = await apiClient.delete(`/listings/${id}`);
                return response.data;
            } catch (error) {
                console.error('Failed to delete listing:', error);
                throw error;
            }
        },

        async search(filters) {
            try {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== '') {
                        params.append(key, value);
                    }
                });

                const response = await apiClient.get('/listings/search', { params });
                return response.data;
            } catch (error) {
                console.error('Failed to search listings:', error);
                throw error;
            }
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
            return response.data.data;
        } catch (error) {
            console.error('Failed to get profile:', error);
            throw error;
        }
    },

    // Profile: Update User Profile
    async updateUserProfile(profileData) {
        try {
            ensureToken();
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            };

            if (profileData.image instanceof File) {
                const formData = new FormData();
                formData.append('image', profileData.image);
                Object.keys(profileData).forEach(key => {
                    if (key !== 'image' && profileData[key] !== null) {
                        formData.append(key, profileData[key]);
                    }
                });

                config.headers['Content-Type'] = 'multipart/form-data';
                const response = await apiClient.put('/profile', formData, config);
                return response.data;
            } else {
                const response = await apiClient.put('/profile', profileData, config);
                return response.data;
            }
        } catch (error) {
            console.error('API: Profile update error:', error);
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

    // Get seller listings
    async getSellerListings() {
        try {
            ensureToken();
            const response = await apiClient.get('/seller/listings');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch seller listings:', error);
            throw error;
        }
    },

    // Messages: Get dashboard messages
    async getDashboardMessages() {
        try {
            ensureToken();
            const response = await apiClient.get('/messages/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard messages:', error);
            throw error;
        }
    },

    // Messages: Get conversation with user
    async getConversation(userId) {
        try {
            ensureToken();
            const response = await apiClient.get(`/messages/conversation/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
            throw error;
        }
    },

    // Messages: Send message
    async sendMessage(messageData) {
        try {
            ensureToken();
            const response = await apiClient.post('/messages/send', messageData);
            return response.data;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    },

    // Get admin listings
    async getAdminListings(page = 1) {
        try {
            ensureToken();
            const response = await apiClient.get('/admin/listings', {
                params: { page, per_page: 10 }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch admin listings:', error);
            throw error;
        }
    }
};