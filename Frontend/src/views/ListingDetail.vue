<template>
  <div class="listing-detail mt-5">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-else-if="hasError" class="error">
      <i class="fas fa-exclamation-circle"></i>
      {{ hasError }}
    </div>
    <div v-else-if="listing" class="listing-content">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-nav">
        <router-link to="/" class="breadcrumb-link">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/listing" class="breadcrumb-link">Listings</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ listing.name }}</span>
      </nav>

      <div class="listing-grid">
        <!-- Left Column - Images -->
        <div class="listing-images-section">
          <div class="main-image">
            <img 
              :src="listing.image_url || getImageUrl(listing.image)" 
              :alt="listing.name"
              @error="(e) => e.target.src = 'https://placehold.co/640x480/004477/FFFFFF?text=No+Image'"
            >
          </div>
          <div class="image-actions">
            <button class="action-btn" @click="zoomImage">
              <i class="fas fa-search-plus"></i> Zoom
            </button>
            <button class="action-btn" @click="shareListing">
              <i class="fas fa-share-alt"></i> Share
            </button>
          </div>

          <div class="image-action">
              <h2><i class="fas fa-map-marked-alt"></i> Location</h2>
              <p class="location">
                <i class="fas fa-map-marker-alt"></i>
                {{ listing.location || 'Location not specified' }}
              </p>
              <MapView 
                v-if="listing.location"
                :location="listing.location"
                class="mt-3"
              />
            </div>

        </div>

        <!-- Right Column - Details -->
        <div class="listing-info-section">
          <div class="listing-header">
            <h1>{{ listing.name }}</h1>
            <div class="listing-meta">
              <span class="price">${{ listing.price }}</span>
              <span class="condition" :class="listing.condition.toLowerCase()">
                {{ listing.condition }}
              </span>
            </div>
          </div>

          <div class="quick-info">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ listing.location || 'Location not specified' }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-calendar-alt"></i>
              <span>Listed {{ formatDate(listing.created_at) }}</span>
            </div>
          </div>

          <div class="listing-actions">
            <button class="primary-btn contact-btn" @click="showMessageForm = !showMessageForm">
              <i class="fas fa-envelope"></i> 
              {{ showMessageForm ? 'Hide Message Form' : 'Contact Seller' }}
            </button>
            <button class="secondary-btn save-btn" @click="saveListing">
              <i class="fas fa-heart"></i> Save
            </button>
          </div>

          <div class="detail-sections">
            <div class="detail-section">
              <h2><i class="fas fa-info-circle"></i> Description</h2>
              <p>{{ listing.description || 'No description available' }}</p>
            </div>

            <div class="detail-section">
              <h2><i class="fas fa-tags"></i> Categories</h2>
              <div class="categories">
                <span class="category-tag" v-for="(category, index) in listing.categories?.split(',')" :key="index">
                  {{ category.trim() }}
                </span>
              </div>
            </div>
            <div class="main-image">
            <img 
              :src="listing.image_url || getImageUrl(listing.image)" 
              :alt="listing.name"
              @error="(e) => e.target.src = 'https://placehold.co/640x480/004477/FFFFFF?text=No+Image'"
            >
          </div>
            
          </div>
        </div>
      </div>

      <MessageForm 
        v-if="showMessageForm"
        :listing-id="listing.id"
        :seller-id="listing.user_id"
        @message-sent="handleMessageSent"
        class="message-form-section"
      />
    </div>
    <div v-else class="error">
      <i class="fas fa-exclamation-triangle"></i>
      Listing not found
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import MessageForm from '@/components/MessageForm.vue';
import MapView from '@/components/MapView.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'ListingDetail',
  
  components: {
    MessageForm,
    MapView
  },
  
  setup() {
    const toast = useToast();
    return { toast };
  },
  
  data() {
    return {
      authStore: useAuthStore(),
      currentImage: 0,
      loading: true,
      error: null,
      listingData: null,
      showMessageForm: false
    };
  },

  computed: {
    listing() {
      return this.listingData || this.authStore.getCurrentListing;
    },
    isLoading() {
      return this.loading || this.authStore.isLoading;
    },
    hasError() {
      return this.error || this.authStore.getError;
    }
  },

  methods: {
    async fetchListingDetails(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await this.authStore.fetchListingById(id);
        if (response.success && response.data) {
          this.listingData = response.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching listing details:', error);
        this.error = error.response?.data?.message || 'Failed to fetch listing details';
        this.toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    getImageUrl(image) {
      if (!image) {
        return 'https://placehold.co/640x480/004477/FFFFFF?text=No+Image';
      }
      
      if (image.startsWith('http')) {
        return image;
      }
      
      const baseUrl = 'http://localhost:8000';
      return `${baseUrl}${image}`;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    handleMessageSent() {
      this.showMessageForm = false;
      this.toast.success('Message sent successfully!');
    },

    zoomImage() {
      const imageUrl = this.listing.image_url || this.getImageUrl(this.listing.image);
      window.open(imageUrl, '_blank');
    },

    async shareListing() {
      try {
        if (navigator.share) {
          await navigator.share({
            title: this.listing.name,
            text: `Check out this listing: ${this.listing.name} - $${this.listing.price}`,
            url: window.location.href
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          const shareUrl = window.location.href;
          await navigator.clipboard.writeText(shareUrl);
          this.toast.success('Link copied to clipboard!');
        }
      } catch (error) {
        console.error('Error sharing listing:', error);
        this.toast.error('Failed to share listing');
      }
    },

    async saveListing() {
      try {
        // Implement save listing functionality
        this.toast.success('Listing saved successfully!');
      } catch (error) {
        console.error('Error saving listing:', error);
        this.toast.error('Failed to save listing');
      }
    }
  },

  mounted() {
    const listingId = this.$route.params.id;
    if (listingId) {
      this.fetchListingDetails(listingId);
    }
  }
};
</script>

<style scoped>
.listing-detail {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f0f8ff; /* Light blue background */
}

.breadcrumb-nav {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.breadcrumb-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #2980b9;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #666;
}

.breadcrumb-current {
  color: #666;
  font-weight: 500;
}

.listing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.listing-images-section {
  position: sticky;
  top: 2rem;
}

.main-image {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #f8f9fa;
  color: #3498db;
}

.listing-info-section {
  padding: 1rem;
}

.listing-header {
  margin-bottom: 2rem;
}

.listing-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  line-height: 1.2;
}

.listing-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #2ecc71;
}

.condition {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

.condition.new {
  background-color: #2ecc71;
  color: white;
}

.condition.used {
  background-color: #f1c40f;
  color: white;
}

.condition.damaged {
  background-color: #e74c3c;
  color: white;
}

.quick-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.info-item i {
  color: #3498db;
}

.listing-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-btn {
  background-color: #3498db;
  color: white;
}

.primary-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.secondary-btn {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #e0e0e0;
}

.secondary-btn:hover {
  background-color: #e9ecef;
  color: #3498db;
}

.detail-sections {
  display: grid;
  gap: 1.5rem;
}

.detail-section {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.detail-section:hover {
  transform: translateY(-2px);
}

.detail-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-section h2 i {
  color: #3498db;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background-color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.3s ease;
}

.category-tag:hover {
  background-color: #3498db;
  color: white;
}

.message-form-section {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #666;
}

@media (max-width: 1024px) {
  .listing-grid {
    grid-template-columns: 1fr;
  }
  
  .listing-images-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .listing-detail {
    padding: 1rem;
  }
  
  .listing-header h1 {
    font-size: 2rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .price {
    font-size: 1.5rem;
  }
  
  .listing-actions {
    flex-direction: column;
  }
  
  .primary-btn, .secondary-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 