<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">Listings</h1>
        
        <!-- Not Authenticated State -->
        <div v-if="!isAuthenticated" class="alert alert-warning">
          Please <router-link to="/login">login</router-link> to view listings.
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- No Results -->
        <div v-else-if="listings.length === 0" class="alert alert-info">
          No listings available.
        </div>

        <!-- Listings Grid -->
        <div v-else>
          <div class="row g-4">
            <div v-for="listing in listings" :key="listing.id" class="col-md-4 col-sm-6">
              <div class="card h-100 listing-card">
                <div class="card-img-container">
                  <img 
                    v-if="listing.image_url" 
                    :src="listing.image_url" 
                    class="card-img-top" 
                    :alt="listing.name"
                    @error="handleImageError"
                  >
                  <img 
                    v-else 
                    src="https://placehold.co/640x480/004477/FFFFFF?text=No+Image" 
                    class="card-img-top" 
                    :alt="listing.name"
                  >
                  <div class="card-img-overlay">
                    <span class="badge bg-primary">{{ listing.condition }}</span>
                  </div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-truncate">{{ listing.name }}</h5>
                  <div class="card-text mb-2">
                    <div class="price-tag">
                      <i class="fas fa-tag"></i>
                      <span class="price">${{ listing.price }}</span>
                    </div>
                  </div>
                  <div class="card-text mb-3">
                    <small class="text-muted">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ listing.location }}
                    </small>
                  </div>
                  <div class="mt-auto">
                    <button class="btn btn-primary w-100" @click="viewListing(listing.id)">
                      <i class="fas fa-eye me-2"></i>View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-center mt-4">
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </li>
                
                <li v-for="page in pagination.last_page" 
                    :key="page" 
                    class="page-item" 
                    :class="{ active: page === pagination.current_page }">
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                
                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Pagination Info -->
          <div class="text-center text-muted mt-2">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} listings
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { computed } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    
    return {
      isAuthenticated
    };
  },

  data() {
    return {
      authStore: useAuthStore(),
      loading: false,
      error: null,
      listings: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
      }
    };
  },

  methods: {
    async fetchListings(page = 1) {
      if (!this.isAuthenticated) {
        this.error = 'Please login to view listings.';
        return;
      }

      this.loading = true;
      this.error = null;
      
      try {
        const response = await this.authStore.fetchListings(page);
        if (response.success) {
          this.listings = response.data;
          this.pagination = response.pagination;
          // Debug: Log the first listing's image URL
          if (this.listings.length > 0) {
            console.log('First listing:', this.listings[0]);
            console.log('Image URL:', this.listings[0].image_url);
            console.log('Raw image path:', this.listings[0].image);
          }
        } else {
          this.error = response.message || 'Failed to fetch listings';
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.error = 'Please login to view listings.';
              break;
            case 404:
              this.error = 'Listings endpoint not found. Please check your API configuration.';
              break;
            case 500:
              this.error = 'Server error. Please try again later.';
              break;
            default:
              this.error = error.response.data?.message || 'Failed to fetch listings';
          }
        } else if (error.message === 'Authentication token is missing') {
          this.error = 'Please login to view listings.';
        } else {
          this.error = 'Network error. Please check your connection.';
        }
      } finally {
        this.loading = false;
      }
    },

    changePage(page) {
      this.fetchListings(page);
    },

    viewListing(id) {
      this.$router.push({ name: 'listing-detail', params: { id } });
    },

    handleImageError(event) {
      event.target.src = 'https://placehold.co/640x480/004477/FFFFFF?text=Image+Not+Available';
    }
  },

  mounted() {
    this.fetchListings();
  }
};
</script>

<style scoped>
.listing-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.listing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-img-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.listing-card:hover .card-img-top {
  transform: scale(1.05);
}

.card-img-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
}

.badge {
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: capitalize;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.price-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.price {
  color: #3498db;
}

.text-muted {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2980b9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-img-container {
    height: 180px;
  }
  
  .price-tag {
    font-size: 1.1rem;
  }
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  color: #3498db;
  border: none;
  padding: 8px 16px;
  margin: 0 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #f8f9fa;
  color: #2980b9;
}

.page-item.active .page-link {
  background-color: #3498db;
  border-color: #3498db;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}

.text-muted {
  font-size: 0.9rem;
}
</style>