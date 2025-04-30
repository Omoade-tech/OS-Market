import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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
                const response = await axios.post(`${API_URL}/login`, credentials);

                if (response.data.token) {
                    // Store both token and user data
                    this.token = response.data.token;
                    this.user = response.data.user;
                    
                    // Save to localStorage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    
                    // Set default auth header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    
                    return response.data;
                }
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
                const response = await axios.post(`${API_URL}/register`, userData);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        },

        clearError() {
            this.error = null;
        },

        async getCurrentUser() {
            try {
                const response = await axios.get(`${API_URL}/user`);
                if (response.data) {
                    this.user = response.data;
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return this.user;
            } catch (error) {
                this.user = null;
                this.token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                return null;
            }
        }
    }
});
