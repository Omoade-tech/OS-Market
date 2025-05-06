import { defineStore } from 'pinia';
import api from '@/services/api.js';
import axios from 'axios';

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
        filterOptions: {
            categories: [],
            conditions: [],
            locations: []
        },
        searchFilters: {
            name: '',
            location: '',
            categories: '',
            condition: '',
            page: 1,
            per_page: 10
        },
        conversations: [],
        currentConversation: null,
        messages: [],
        unreadCount: 0
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
        },

        // Filter options getters
        getCategories(state) {
            return state.filterOptions.categories;
        },
        getConditions(state) {
            return state.filterOptions.conditions;
        },
        getLocations(state) {
            return state.filterOptions.locations;
        },
        getSearchFilters(state) {
            return state.searchFilters;
        },

        // Messages getters
        getConversations() {
            return this.conversations;
        },
        getCurrentConversation() {
            return this.currentConversation;
        },
        getMessages() {
            return this.messages;
        },
        getUnreadCount() {
            return this.unreadCount;
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
            this.listings = [];
            this.currentListing = null;
            this.filterOptions = { categories: [], conditions: [], locations: [] };
            this.searchFilters = { name: '', location: '', categories: '', condition: '', page: 1, per_page: 10 };
            this.conversations = [];
            this.currentConversation = null;
            this.messages = [];
            this.unreadCount = 0;
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

        async updateListing(id, formData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.updateListing(id, formData);
                if (response && response.success) {
                    // Refresh the listings after successful update
                    await this.fetchSellerListings();
                    return response;
                }
                throw new Error(response?.message || 'Failed to update listing');
            } catch (error) {
                console.error('Update listing error:', error);
                this.error = error.response?.data?.message || error.message || 'Failed to update listing';
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

        // Search and filter actions
        async fetchFilterOptions() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getFilterOptions();
                if (response.success) {
                    this.filterOptions = response.data;
                    return response.data;
                }
                throw new Error('Failed to fetch filter options');
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch filter options';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async searchListings(filters) {
            this.loading = true;
            this.error = null;

            try {
                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => 
                        value !== '' && value !== null && value !== undefined
                    )
                );

                const response = await api.searchListings(cleanFilters);
                if (response.success) {
                    this.listings = response.data;
                    return response;
                } else {
                    throw new Error(response.message || 'Failed to search listings');
                }
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to search listings';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        updateSearchFilters(filters) {
            this.searchFilters = { ...this.searchFilters, ...filters };
        },

        clearSearchFilters() {
            this.searchFilters = {
                name: '',
                location: '',
                categories: '',
                condition: '',
                min_price: null,
                max_price: null,
                page: 1,
                per_page: 10
            };
        },

        // Seller listing actions
        async fetchSellerListings() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getSellerListings();
                if (response.success) {
                    this.listings = response.data.map(listing => ({
                        id: listing.id,
                        name: listing.name,
                        description: listing.description,
                        price: listing.price,
                        location: listing.location,
                        categories: listing.category,
                        condition: listing.condition,
                        status: listing.status || 'active',
                        image: listing.image ? `/storage/${listing.image}` : null,
                        created_at: listing.created_at,
                        updated_at: listing.updated_at
                    }));
                    return this.listings;
                } else {
                    throw new Error(response.message || 'Failed to fetch seller listings');
                }
            } catch (error) {
                this.error = error.message || 'Failed to fetch seller listings';
                this.listings = [];
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteListing(listingId) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.deleteListing(listingId);
                this.listings = this.listings.filter(listing => listing.id !== listingId);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to delete listing';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Messages actions
        async fetchConversations() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getDashboardMessages();
                if (response.success) {
                    this.conversations = response.messages;
                    this.unreadCount = response.unread_count || 0;
                    return response;
                }
                throw new Error('Failed to fetch conversations');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to fetch conversations';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchConversation(userId) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getConversation(userId);
                if (response.success) {
                    this.messages = response.conversation;
                    this.currentConversation = {
                        id: userId,
                        messages: response.conversation
                    };
                    return response;
                }
                throw new Error('Failed to fetch conversation');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to fetch conversation';
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
                if (response.success) {
                    this.messages.push(response.data);
                    // Update the last message in conversations
                    const conversationIndex = this.conversations.findIndex(
                        conv => conv.id === messageData.receiver_id
                    );
                    if (conversationIndex !== -1) {
                        this.conversations[conversationIndex].last_message = messageData.message;
                        this.conversations[conversationIndex].last_message_at = new Date().toISOString();
                    }
                    return response;
                }
                throw new Error('Failed to send message');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to send message';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        clearCurrentConversation() {
            this.currentConversation = null;
            this.messages = [];
        }
    }
});