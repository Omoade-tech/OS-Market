import { defineStore } from 'pinia';
import axios from 'axios';

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
            console.log('Authorization header set:', config.headers.Authorization); // Debug log
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

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated() {
            return !!this.token;
        },
        currentUser() {
            return this.user;
        },
        userRole() {
            return this.user?.role || null;
        }
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const response = await apiClient.post('/login', credentials);
                if (response.data.token) {
                    this.token = response.data.token;
                    this.user = response.data.user;
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    return response.data;
                }
                throw new Error('Login failed: Invalid response format');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await apiClient.post('/register', userData);
                if (response.data.success) {
                    return response.data;
                }
                throw new Error(response.data.message || 'Registration failed');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            apiClient.post('/logout').catch(error => {
                console.error('Logout request failed:', error);
            });
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },

        clearError() {
            this.error = null;
        },

        async getCurrentUser() {
            try {
                const response = await apiClient.get('/user');
                if (response.data) {
                    this.user = response.data;
                    localStorage.setItem('user', JSON.stringify(response.data));
                    return response.data;
                }
                throw new Error('Failed to get current user');
            } catch (error) {
                console.error('Error getting current user:', error);
                if (error.response && error.response.status === 401) {
                    this.user = null;
                    this.token = null;
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
                throw error;
            }
        },

        async fetchUserProfile() {
            this.loading = true;
            this.error = null;

            try {
                const response = await apiClient.get('/profile');
                if (response.data.success) {
                    this.user = response.data.data;
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    return response.data.data;
                }
                throw new Error(response.data.message || 'Failed to fetch profile');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to fetch profile';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(profileData) {
            this.loading = true;
            this.error = null;

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };

                // Log request data for debugging
                console.log('Sending profile update data:', profileData);

                // Ensure status is included in the request
                const requestData = {
                    ...profileData,
                    status: profileData.status || null
                };

                const response = await apiClient.put('/profile', requestData, config);
                console.log('Update profile response:', response.data);

                if (response.data.success) {
                    const updatedUser = response.data.data;
                    this.user = updatedUser;
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    return updatedUser;
                }
                throw new Error(response.data.message || 'Failed to update profile');
            } catch (error) {
                console.error('Profile update error:', error);
                if (error.response?.data?.errors) {
                    console.error('Validation errors:', error.response.data.errors);
                    // Format validation errors for better display
                    const formattedErrors = Object.entries(error.response.data.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('\n');
                    this.error = formattedErrors;
                } else {
                    this.error = error.response?.data?.message || error.message || 'Failed to update profile';
                }
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
