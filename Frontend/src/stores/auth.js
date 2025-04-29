import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated() {
            return !!this.user;
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
                    this.user = response.data;
                    localStorage.setItem('user', JSON.stringify(response.data));
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
            localStorage.removeItem('user');
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
                localStorage.removeItem('user');
                return null;
            }
        }
    }
});
