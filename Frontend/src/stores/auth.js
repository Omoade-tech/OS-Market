import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Auth state
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,

        // Listings state
        listings: [],
        currentListing: null,
    }),

    getters: {
        // Auth getters
        isAuthenticated() {
            return !!this.token;
        },
        currentUser() {
            return this.user;
        },
        userRole() {
            return this.user?.role || null;
        },

        // Listings getters
        getListings(state) {
            return state.listings;
        },
        getCurrentListing(state) {
            return state.currentListing;
        },
        isLoading(state) {
            return state.loading;
        },
        getError(state) {
            return state.error;
        }
    },

    actions: {
        // Auth actions
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.login(credentials);
                if (response.token) {
                    this.token = response.token;
                    this.user = response.user;
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    return response;
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
                const response = await api.register(userData);
                if (response.success) {
                    return response;
                }
                throw new Error(response.message || 'Registration failed');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            api.logout().catch(error => {
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
                const response = await api.getCurrentUser();
                if (response) {
                    this.user = response;
                    localStorage.setItem('user', JSON.stringify(response));
                    return response;
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
                 const response = await api.getUserProfile();
                if (response) {
                    this.user = response;
                    localStorage.setItem('user', JSON.stringify(response));
                    return response;
                }
                throw new Error('Failed to fetch profile');
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
                const response = await api.updateUserProfile(profileData);
                if (response && response.data) {
                    this.user = response.data;
                    localStorage.setItem('user', JSON.stringify(response.data));
                    return response.data;
                }
                throw new Error('Failed to update profile: Invalid response format');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to update profile';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Listing actions
        async fetchListings(page = 1) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getListings(page);
                if (response.success) {
                    this.listings = response.data;
                    return response;
                } else {
                    throw new Error(response.message || 'Failed to fetch listings');
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch listings';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchUserListings(userId) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getUserListings(userId);
                this.listings = response.data;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch user listings';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchListingById(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getListingById(id);
                this.currentListing = response;
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch listing';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createListing(listingData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.createListing(listingData);
                await this.fetchListings();
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to create listing';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateListing(id, listingData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.updateListing(id, listingData);

                if (this.currentListing && this.currentListing.id === id) {
                    this.currentListing = response;
                }

                await this.fetchListings();
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to update listing';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteListing(id) {
            this.loading = true;
            this.error = null;

            try {
                await api.deleteListing(id);
                this.listings = this.listings.filter(listing => listing.id !== id);
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete listing';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async sendMessage(messageData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.sendMessage(messageData);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to send message';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
