import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = 'http://localhost:8000/api';

// Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json'
    },
    timeout: 30000,
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData requests
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        // Log request data for debugging
        console.log('Request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data instanceof FormData ? 'FormData' : config.data
        });

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    // Clear auth data on unauthorized
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 422:
                    console.error('Validation error:', data.errors);
                    break;
                default:
                    console.error('API error:', data);
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
            console.log('API: Sending profile update data:', profileData);
            const response = await apiClient.put('/profile', profileData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('API: Profile update response:', response.data);
            return response.data;
        } catch (error) {
            console.error('API: Profile update error:', error.response?.data || error.message);
            throw error;
        }
    }
};