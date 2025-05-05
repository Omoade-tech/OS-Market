<template>
  <div class="seller-listings">
    <div class="header">
      <h1>My Listings</h1>
      <router-link to="/seller/add-listing" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add New Listing
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="listings.length === 0" class="no-listings">
      <p>You haven't created any listings yet.</p>
      <router-link to="/seller/add-listing" class="btn btn-primary">
        Create Your First Listing
      </router-link>
    </div>

    <div v-else class="listings-grid">
      <div v-for="listing in listings" :key="listing.id" class="listing-card">
        <div class="listing-image">
          <img :src="listing.image" :alt="listing.title">
        </div>
        <div class="listing-info">
          <h3>{{ listing.title }}</h3>
          <p class="price">${{ listing.price }}</p>
          <p class="description">{{ listing.description }}</p>
          <div class="listing-meta">
            <span class="category">{{ listing.category }}</span>
            <span class="condition">{{ listing.condition }}</span>
            <span class="status" :class="listing.status">{{ listing.status }}</span>
          </div>
          <div class="listing-actions">
            <router-link :to="'/seller/edit-listing/' + listing.id" class="btn btn-sm btn-outline-primary">
              <i class="fas fa-edit"></i> Edit
            </router-link>
            <button @click="deleteListing(listing.id)" class="btn btn-sm btn-outline-danger">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useToast } from 'vue-toastification'

export default {
  name: 'ViewSellerListing',
  data() {
    return {
      loading: false,
      listings: []
    }
  },
  methods: {
    async fetchListings() {
      this.loading = true
      try {
        const authStore = useAuthStore()
       
        const response = await authStore.fetchSellerListings()
      
        this.listings = authStore.listings
        console.log('Updated listings:', this.listings)
      } catch (error) {

        useToast().error('Failed to load listings: ' + (error.response?.data?.message || error.message))
      } finally {
        this.loading = false
      }
    },
    async deleteListing(listingId) {
      if (!confirm('Are you sure you want to delete this listing?')) {
        return
      }

      try {
        const authStore = useAuthStore()
        await authStore.deleteListing(listingId)
        this.listings = authStore.listings
        useToast().success('Listing deleted successfully')
      } catch (error) {
        console.error('Error deleting listing:', error)
        useToast().error('Failed to delete listing')
      }
    }
  },
  created() {
    this.fetchListings()
  }
}
</script>

<style scoped>
.seller-listings {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.no-listings {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-listings p {
  margin-bottom: 20px;
  color: #666;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.listing-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.listing-card:hover {
  transform: translateY(-5px);
}

.listing-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.listing-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listing-info {
  padding: 15px;
}

.listing-info h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 10px;
}

.description {
  color: #666;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.listing-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.listing-meta span {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.category {
  background-color: #e9ecef;
  color: #495057;
}

.condition {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status {
  background-color: #d4edda;
  color: #155724;
}

.status.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.listing-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .listings-grid {
    grid-template-columns: 1fr;
  }
}
</style> 