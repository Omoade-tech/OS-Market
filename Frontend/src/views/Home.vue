<template>
    <div class="position-relative w-100" style="height: 600px; overflow: hidden;">
      <!-- Carousel Container -->
      <div class="position-relative w-100 h-100">
        <!-- Carousel Slides -->
        <div v-for="(slide, index) in slides" 
             :key="index"
             class="position-absolute w-100 h-100 transition-opacity"
             :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
             style="transition-duration: 1000ms;">
          <img :src="slide.image" 
               :alt="slide.alt" 
               class="w-100 h-100 object-fit-cover" />
          
          <!-- Overlay Content -->
          <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
            <div class="text-center text-white px-4 px-md-8">
              <h1 class="display-4 fw-bold mb-4">
                Welcome to Open Source Market
              </h1>
              <p class="fs-4 mb-4">
                Where buyers and sellers meet for the exchange of services
              </p>
              <router-link to="/signup" 
                          class="btn btn-primary btn-lg rounded-pill px-5 py-3">
                Let's Get Started
              </router-link>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Navigation Dots -->
      <div class="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 p-3">
        <button v-for="(_, index) in slides" 
                :key="index"
                @click="goToSlide(index)"
                class="btn btn-sm rounded-circle p-0"
                :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
                style="width: 12px; height: 12px;"
                :aria-label="`Go to slide ${index + 1}`">
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentSlide: 0,
        slides: [
          {
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            alt: 'Marketplace 1'
          },
          {
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            alt: 'Marketplace 2'
          },
          {
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            alt: 'Marketplace 3'
          },
          {
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            alt: 'Marketplace 4'
          },
          {
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            alt: 'Marketplace 5'
          },
          {
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            alt: 'Marketplace 6'
          }
        ],
        interval: null
      }
    },
    methods: {
      goToSlide(index) {
        this.currentSlide = index;
      },
      startAutoSlide() {
        this.interval = setInterval(() => {
          this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        }, 5000);
      }
    },
    mounted() {
      this.startAutoSlide();
    },
    beforeUnmount() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }
  </script> 