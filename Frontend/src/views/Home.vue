<template>
  <div>
    <!-- Hero Section -->
    <section class="position-relative w-100" style="height: 600px; overflow: hidden;">
      <div class="position-relative w-100 h-100">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="position-absolute w-100 h-100 transition-opacity"
          :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
          style="transition-duration: 1000ms;"
        >
          <img
            :src="slide.image"
            :alt="slide.alt"
            class="w-100 h-100 object-fit-cover"
            @error="onImageError($event)"
          />
          <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
            <div class="text-center text-white px-4 px-md-8">
              <h1 class="display-4 fw-bold mb-4">Welcome to Open Source Market</h1>
              <p class="fs-4 mb-1">Where buyers and sellers meet for the exchange of services</p>

              
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <SearchComponent 
              @search-results="handleSearchResults"
              @search-error="handleSearchError"
              @clear-filters="handleClearFilters"
            />
          </div>
        </div>
      </div>
  
              <router-link to="/login" class="btn btn-primary btn-lg rounded-pill px-5 py-3">
                Join Now
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 p-3">
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          class="btn btn-sm rounded-circle p-0"
          :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
          style="width: 12px; height: 12px;"
        ></button>
      </div>
    </section>

    <!-- Why Join Us -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Why Join Open Source Market?</h2>
        <div class="row g-4">
          <div class="col-md-4" v-for="(feature, index) in features" :key="index">
            <div class="card h-100 shadow-sm text-center border-0">
              <div class="card-body">
                <i :class="feature.icon" class="fs-1 text-primary mb-3"></i>
                <h5 class="fw-semibold">{{ feature.title }}</h5>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">How It Works</h2>
        <div class="row text-center g-4">
          <div class="col-md-4">
            <i class="bi bi-person-plus fs-1 text-success mb-2"></i>
            <h5 class="fw-semibold">1. Sign Up</h5>
            <p>Create a free account to get started.</p>
          </div>
          <div class="col-md-4">
            <i class="bi bi-search fs-1 text-warning mb-2"></i>
            <h5 class="fw-semibold">2. Explore</h5>
            <p>Browse or offer services based on your needs.</p>
          </div>
          <div class="col-md-4">
            <i class="bi bi-cash-stack fs-1 text-info mb-2"></i>
            <h5 class="fw-semibold">3. Transact</h5>
            <p>Connect and complete deals with secure payments.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">What Our Users Say</h2>
        <div class="row g-4">
          <div class="col-md-4" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="card shadow-sm h-100 border-0">
              <div class="card-body">
                <p class="mb-3">"{{ testimonial.quote }}"</p>
                <div class="fw-bold">{{ testimonial.name }}</div>
                <small class="text-muted">{{ testimonial.role }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  

    <!-- Featured Listings -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">Featured Listings</h2>
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else class="row g-4">
          <div v-for="listing in featuredListings" :key="listing.id" class="col-md-4 col-sm-6">
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
                  <router-link :to="{ name: 'listing-detail', params: { id: listing.id }}" class="btn btn-primary w-100">
                    <i class="fas fa-eye me-2"></i>View Details
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 text-center bg-primary text-white">
      <div class="container">
        <h2 class="fw-bold mb-3">Ready to get started?</h2>
        <p class="mb-4">Join a community of forward-thinking professionals today.</p>
        <router-link to="/signup" class="btn btn-light btn-lg rounded-pill px-5 py-3">
          Create Your Account
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import SearchComponent from '@/components/SearchComponent.vue';

export default {
  components: {
    SearchComponent
  },
  data() {
    return {
      currentSlide: 0,
      placeholder: 'https://via.placeholder.com/2070x600?text=Image+Unavailable',
      interval: null,
      loading: false,
      error: null,
      featuredListings: [],
      slides: [
        { image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', alt: 'Tech workspace' },
        { image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', alt: 'Freelancer coding' },
        { image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', alt: 'Team collaboration' }
      ],
      features: [
        { icon: 'bi bi-globe2', title: 'Global Exposure', description: 'Connect with a worldwide network.' },
        { icon: 'bi bi-shield-lock-fill', title: 'Secure Transactions', description: 'Safe and encrypted payments.' },
        { icon: 'bi bi-chat-dots-fill', title: '24/7 Support', description: 'Get help when you need it most.' }
      ],
      testimonials: [
        { quote: 'This platform helped me find amazing clients!', name: 'Jane Doe', role: 'Freelancer' },
        { quote: "It's simple, fast, and reliable.", name: 'John Smith', role: 'Buyer' },
        { quote: 'The best place to showcase your digital services.', name: 'Amina Yusuf', role: 'Developer' }
      ]
    };
  },
  methods: {
    goToSlide(index) {
      this.currentSlide = index;
    },
    startAutoSlide() {
      this.interval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      }, 5000);
    },
    onImageError(event) {
      event.target.src = this.placeholder;
    },
    async fetchFeaturedListings() {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const response = await authStore.fetchListings(1);
        if (response.success) {
          this.featuredListings = response.data.slice(0, 9); // Get first 9 listings
        } else {
          this.error = response.message || 'Failed to fetch listings';
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error);
        this.error = 'Failed to load featured listings';
      } finally {
        this.loading = false;
      }
    },
    
  },
  mounted() {
    this.startAutoSlide();
    this.fetchFeaturedListings();
  },
  beforeUnmount() {
    clearInterval(this.interval);
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
</style>
