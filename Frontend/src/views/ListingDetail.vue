<template>
  <div class="listing-detail">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-else-if="hasError" class="error">
      {{ hasError }}
    </div>
    <div v-else-if="listing" class="listing-content">
      <div class="listing-header">
        <h1>{{ listing.name }}</h1>
        <div class="listing-meta">
          <span class="price">${{ listing.price }}</span>
          <span class="condition">{{ listing.condition }}</span>
        </div>
      </div>

      <div class="listing-images">
        <div class="main-image">
          <img 
            :src="listing.image_url || getImageUrl(listing.image)" 
            :alt="listing.name"
            @error="(e) => e.target.src = 'https://placehold.co/640x480/004477/FFFFFF?text=No+Image'"
          >
        </div>
      </div>

      <div class="listing-details">
        <div class="detail-section">
          <h2>Location</h2>
          <p class="location">
            <i class="fas fa-map-marker-alt"></i>
            {{ listing.location || 'Location not specified' }}
          </p>
        </div>

        <div class="detail-section">
          <h2>Description</h2>
          <p>{{ listing.description || 'No description available' }}</p>
        </div>

        <div class="detail-section">
          <h2>Categories</h2>
          <div class="categories">
            <span class="category-tag">
              {{ listing.categories || 'Uncategorized' }}
            </span>
          </div>
        </div>

        <div class="detail-section">
          <h2>Condition</h2>
          <p class="condition-detail">
            <i class="fas fa-tag"></i>
            {{ listing.condition || 'Condition not specified' }}
          </p>
        </div>

        <div class="listing-actions">
          <button class="contact-btn" @click="showMessageForm = !showMessageForm">
            <i class="fas fa-envelope"></i> {{ showMessageForm ? 'Hide Message Form' : 'Contact Seller' }}
          </button>
        </div>
      </div>

      <MessageForm 
        v-if="showMessageForm"
        :listing-id="listing.id"
        :seller-id="listing.user_id"
        @message-sent="handleMessageSent"
      />
    </div>
    <div v-else class="error">
      Listing not found
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import MessageForm from '@/components/MessageForm.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'ListingDetail',
  
  components: {
    MessageForm
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
}

.listing-header {
  margin-bottom: 2rem;
  text-align: center;
}

.listing-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.listing-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2ecc71;
}

.condition {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border-radius: 20px;
}

.listing-images {
  margin-bottom: 2rem;
}

.main-image {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listing-details {
  display: grid;
  gap: 2rem;
}

.detail-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #666;
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
}

.condition-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: #666;
}

.listing-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.contact-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .listing-header h1 {
    font-size: 2rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .price {
    font-size: 1.5rem;
  }
}
</style> 