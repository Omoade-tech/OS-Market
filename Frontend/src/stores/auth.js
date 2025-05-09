import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useAuthStore = defineStore('auth', {
    state: () => {
        const storedUser = JSON.parse(localStorage.getItem('user')) || null;
        return {
            // Auth state
            user: storedUser,
            token: localStorage.getItem('token') || null,
            isAuthenticated: !!localStorage.getItem('token'),
            isAdmin: storedUser?.role === 'admin' || false,
            isSeller: storedUser?.role === 'seller' || false,
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
            unreadCount: 0,
            // Add status update state
            statusUpdateLoading: false,
            statusUpdateError: null
        };
    },

    getters: {
        // Auth getters
        getUser() {
            return this.user;
        },
        getToken() {
            return this.token;
        },
        getIsAuthenticated() {
            return this.isAuthenticated;
        },
        getIsAdmin() {
            return this.isAdmin;
        },
        getIsSeller() {
            return this.isSeller;
        },
        getLoading() {
            return this.loading;
        },
        getError() {
            return this.error;
        },

        // Listings getters
        getListings(state) {
            return state.listings;
        },
        getCurrentListing(state) {
            return state.currentListing;
        },
        getStatusUpdateLoading(state) {
            return state.statusUpdateLoading;
        },
        getStatusUpdateError(state) {
            return state.statusUpdateError;
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
            try {
                this.loading = true;
                this.error = null;
                const response = await api.auth.login(credentials);
                this.user = response.user;
                this.token = response.token;
                this.isAuthenticated = true;
                this.isAdmin = response.user.role === 'admin';
                this.isSeller = response.user.role === 'seller';
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.auth.register(userData);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                this.loading = true;
                this.error = null;
                await api.auth.logout();
                this.clearAuth();
            } catch (error) {
                this.error = error.response?.data?.message || 'Logout failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.isAdmin = false;
            this.isSeller = false;
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
            try {
                const response = await api.listings.getAll(page, 'approved');
                this.listings = response.data;
                return response;
            } catch (error) {
                console.error('Error fetching listings:', error);
                throw error;
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
                const response = await api.listings.getById(id);
                this.currentListing = response.data;
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
                const response = await api.listings.create(listingData);
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
                const response = await api.listings.update(id, formData);
                if (response.success) {
                    // Update the listing in the local state
                    const index = this.listings.findIndex(listing => listing.id === id);
                    if (index !== -1) {
                        this.listings[index] = response.data;
                    }
                    return response;
                }
                throw new Error(response.message || 'Failed to update listing');
            } catch (error) {
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

                const response = await api.listings.search(cleanFilters);
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
                        categories: listing.categories,
                        condition: listing.condition,
                        status: listing.status || 'active',
                        image: listing.image,
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
        async sendMessage(messageData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.messages.sendMessage(messageData);
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

        async fetchConversations() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.messages.getDashboardMessages();
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
                const response = await api.messages.getConversation(userId);
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

        clearCurrentConversation() {
            this.currentConversation = null;
            this.messages = [];
        },

        // Add new action for updating listing status
        async updateListingStatus(listingId, status) {
            this.statusUpdateLoading = true;
            this.statusUpdateError = null;

            try {
                if (!this.isAdmin) {
                    throw new Error('Unauthorized: Only admins can update listing status');
                }

                const response = await api.admin.updateListingStatus(listingId, status);
                
                if (response.success) {
                    // Update the listing in the current listings array if it exists
                    const listingIndex = this.listings.findIndex(listing => listing.id === listingId);
                    if (listingIndex !== -1) {
                        this.listings[listingIndex] = response.data;
                    }
                    
                    // Update current listing if it's the one being modified
                    if (this.currentListing && this.currentListing.id === listingId) {
                        this.currentListing = response.data;
                    }
                    
                    return response.data;
                }
                
                throw new Error(response.message || 'Failed to update listing status');
            } catch (error) {
                this.statusUpdateError = error.response?.data?.message || error.message || 'Failed to update listing status';
                throw error;
            } finally {
                this.statusUpdateLoading = false;
            }
        },

        // Admin actions
        async getAdminStats() {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.admin.getStats();
                if (response.success) {
                    return response;
                }
                throw new Error(response.message || 'Failed to fetch admin stats');
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Failed to fetch admin stats';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getAllListings(page = 1) {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.getAdminListings(page);
                if (response.success) {
                    this.listings = response.data;
                    return response;
                } else {
                    throw new Error(response.message || 'Failed to fetch admin listings');
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch admin listings';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getListingDetails(listingId) {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.admin.getListingDetails(listingId);
                return response;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch listing details';
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
