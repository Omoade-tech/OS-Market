<template>
  <div class="seller-listings">
    <div class="header">
      <h1>My Listings</h1>
      <router-link to="/seller/add-listing" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add New Listing
      </router-link>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
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

    <div v-else class="listings-grid w-100">
      <div v-for="listing in listings" :key="listing.id" class="listing-card">
        <div class="listing-image">
          <img 
            v-if="listing.image" 
            :src="listing.image_url || `${apiUrl}/storage/${listing.image}`" 
            :alt="listing.name"
            @error="handleImageError"
            @load="handleImageLoad"
          >
          <img 
            v-else 
            src="https://placehold.co/640x480/004477/FFFFFF?text=No+Image" 
            :alt="listing.name"
          >
        </div>
        <div class="listing-info">
          <h3>{{ listing.name }}</h3>
          <p class="price">${{ listing.price }}</p>
          <p class="description">{{ listing.description }}</p>
          <div class="listing-meta">
            <span class="category">{{ formatCategory(listing.categories) }}</span>
            <span class="condition">{{ formatCondition(listing.condition) }}</span>
            <span class="status" :class="listing.status">{{ formatStatus(listing.status) }}</span>
            <span class="location">{{ listing.location }}</span>
          </div>
          <div class="listing-actions">
            <button @click="openEditModal(listing)" class="btn btn-sm btn-outline-primary">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button @click="deleteListing(listing.id)" class="btn btn-sm btn-outline-danger">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Listing Modal -->
    <div class="modal fade" id="editListingModal" tabindex="-1" aria-labelledby="editListingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editListingModalLabel">Edit Listing</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateListing" class="edit-listing-form">
              <div class="mb-3">
                <label for="name" class="form-label">Title</label>
                <input type="text" class="form-control" id="name" v-model="editingListing.name" required>
              </div>
              
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" v-model="editingListing.description" rows="3" required></textarea>
              </div>
              
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" v-model="editingListing.price" required step="0.01" min="0">
              </div>
              
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input type="text" class="form-control" id="location" v-model="editingListing.location" required>
              </div>
              
              <div class="mb-3">
                <label for="categories" class="form-label">Category</label>
                <select class="form-select" id="categories" v-model="editingListing.categories" required>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home-garden">Home & Garden</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="jobs">Jobs</option>
                  <option value="services">Services</option>
                  <option value="education">Education</option>
                  <option value="health-beauty">Health & Beauty</option>
                  <option value="sports-fitness">Sports & Fitness</option>
                  <option value="pets">Pets</option>
                  <option value="food-drinks">Food & Drinks</option>
                  <option value="art-collectibles">Art & Collectibles</option>
                  <option value="books-music-movies">Books, Music & Movies</option>
                  <option value="business-equipment">Business Equipment</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label for="condition" class="form-label">Condition</label>
                <select class="form-select" id="condition" v-model="editingListing.condition" required>
                  <option value="new">New</option>
                  <option value="used-like-new">Used - Like New</option>
                  <option value="used-good">Used - Good</option>
                  <option value="used-fair">Used - Fair</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label for="image" class="form-label">Image</label>
                <input type="file" class="form-control" id="image" @change="handleImageChange" accept="image/*">
                <small class="text-muted">Leave empty to keep current image</small>
                <div v-if="imagePreview || originalListing?.image" class="mt-2">
                  <img :src="imagePreview || originalListing?.image" alt="Preview" style="max-width: 200px; max-height: 200px;">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="updateListing" :disabled="updating">
              <span v-if="updating" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {{ updating ? 'Updating...' : 'Update Listing' }}
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
import { Modal } from 'bootstrap'

export default {
  setup() {
    const auth = useAuthStore()
    const toast = useToast()
    return { auth, toast }
  },
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      listings: [],
      loading: true,
      error: null,
      editingListing: {
        id: null,
        name: '',
        description: '',
        price: 0,
        location: '',
        categories: '',
        condition: '',
        status: '',
        image: null
      },
      originalListing: null,
      updating: false,
      editModal: null,
      imagePreview: null
    }
  },
  methods: {
    formatText(text, separator = /[-_]/) {
      if (!text) return 'Unknown';
      return text.split(separator)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    },
    formatCategory(category) {
      if (!category) return 'Unknown';
      // Handle both string and array categories
      const categoryValue = Array.isArray(category) ? category[0] : category;
      return this.formatText(categoryValue);
    },
    formatCondition(condition) {
      return this.formatText(condition, '-');
    },
    formatStatus(status) {
      if (!status) return 'Active';
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    },
    async fetchListings() {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        await authStore.fetchSellerListings();
        this.listings = authStore.listings;
        console.log('API URL:', this.apiUrl);
        console.log('Listings:', this.listings);
        if (this.listings.length > 0) {
          const firstListing = this.listings[0];
          console.log('First listing image data:', {
            image: firstListing.image,
            image_url: firstListing.image_url,
            full_url: `${this.apiUrl}/storage/${firstListing.image}`,
            final_url: firstListing.image_url || `${this.apiUrl}/storage/${firstListing.image}`
          });
        }
      } catch (error) {
        this.error = error.message;
        useToast().error('Failed to load listings: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    openEditModal(listing) {
      // Create a deep copy of the listing to avoid direct reference
      this.originalListing = JSON.parse(JSON.stringify(listing));
      this.editingListing = {
        id: listing.id,
        name: listing.name || '',
        description: listing.description || '',
        price: listing.price ? parseFloat(listing.price) : '',
        location: listing.location || '',
        categories: listing.categories || '',
        condition: listing.condition || '',
        image: null
      };
      
      // Initialize Bootstrap modal if not already initialized
      if (!this.editModal) {
        const modalEl = document.getElementById('editListingModal');
        this.editModal = new Modal(modalEl);
      }
      this.editModal.show();
    },
    handleImageChange(event) {
      this.editingListing.image = event.target.files[0];
      if (this.editingListing.image) {
        this.imagePreview = URL.createObjectURL(this.editingListing.image);
      } else {
        this.imagePreview = null;
      }
    },
    handleImageError(event) {
      console.log('Image load error:', {
        src: event.target.src,
        image: event.target.dataset.image
      });
      event.target.src = 'https://placehold.co/640x480/004477/FFFFFF?text=Image+Not+Available';
    },
    handleImageLoad(event) {
      console.log('Image loaded successfully:', event.target.src);
    },
    async updateListing() {
      this.updating = true;
      try {
        console.log('Starting update with data:', this.editingListing);
        
        if (!this.editingListing.price || this.editingListing.price <= 0) {
          useToast().error('Price must be greater than 0');
          return;
        }

        // const authStore = useAuthStore();
        const formData = new FormData();
        
        // Add all fields to FormData
        formData.append('name', this.editingListing.name);
        formData.append('description', this.editingListing.description);
        formData.append('price', this.editingListing.price);
        formData.append('location', this.editingListing.location);
        formData.append('categories', this.editingListing.categories);
        formData.append('condition', this.editingListing.condition);
        
        // Only append image if it's been changed
        if (this.editingListing.image instanceof File) {
          formData.append('image', this.editingListing.image);
        }

        // Add _method for Laravel to handle PUT request
        formData.append('_method', 'PUT');

        const response = await authStore.updateListing(this.editingListing.id, formData);
        
        if (response.success) {
          // Update the listing in the local state
          const index = this.listings.findIndex(l => l.id === this.editingListing.id);
          if (index !== -1) {
            this.listings[index] = response.data;
          }
          
          useToast().success('Listing updated successfully');
          this.editModal.hide();
          this.imagePreview = null;
          this.editingListing = {
            id: null,
            name: '',
            description: '',
            price: '',
            location: '',
            categories: '',
            condition: '',
            image: null
          };
        } else {
          throw new Error(response.message || 'Failed to update listing');
        }
      } catch (error) {
        console.error('Error updating listing:', error);
        useToast().error(error.response?.data?.message || error.message || 'Failed to update listing');
      } finally {
        this.updating = false;
      }
    },
    resetForm() {
      this.editingListing = {
        id: null,
        name: '',
        description: '',
        price: '',
        location: '',
        categories: '',
        condition: '',
        image: null
      };
      this.originalListing = null;
      this.imagePreview = null;
    },
    async deleteListing(listingId) {
      if (!confirm('Are you sure you want to delete this listing?')) {
        return;
      }

      try {
        const authStore = useAuthStore();
        await authStore.deleteListing(listingId);
        this.listings = authStore.listings;
        useToast().success('Listing deleted successfully');
      } catch (error) {
        useToast().error('Failed to delete listing');
      }
    }
  },
  mounted() {
    document.getElementById('editListingModal').addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
    this.fetchListings();
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
  text-transform: capitalize;
}

.condition {
  background-color: #e3f2fd;
  color: #1976d2;
  text-transform: capitalize;
}

.status {
  background-color: #d4edda;
  color: #155724;
  text-transform: capitalize;
}

.status.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.location {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  text-transform: capitalize;
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

.edit-listing-form {
  max-width: 100%;
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