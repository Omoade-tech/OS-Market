<template>
  <div class="add-listing-container">
    <div class="card">
      <div class="card-header">
        <h4>Add New Listing</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitListing">
          <div class="mb-3">
            <label for="name" class="form-label">Items Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="form.name" 
              :class="{'is-invalid': errors.name}"
              required
            >
            <div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea 
              class="form-control" 
              id="description" 
              v-model="form.description" 
              rows="4" 
              :class="{'is-invalid': errors.description}"
              required
            ></textarea>
            <div class="invalid-feedback" v-if="errors.description">{{ errors.description[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input 
              type="number" 
              class="form-control" 
              id="price" 
              v-model="form.price" 
              step="0.01" 
              :class="{'is-invalid': errors.price}"
              required
            >
            <div class="invalid-feedback" v-if="errors.price">{{ errors.price[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <select 
              class="form-select" 
              id="category" 
              v-model="form.categories" 
              :class="{'is-invalid': errors.categories}"
              required
            >
              <option value="">Select a category</option>
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
            <div class="invalid-feedback" v-if="errors.categories">{{ errors.categories[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="condition" class="form-label">Condition</label>
            <select 
              class="form-select" 
              id="condition" 
              v-model="form.condition" 
              :class="{'is-invalid': errors.condition}"
              required
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="used-like-new">Used - Like New</option>
              <option value="used-good">Used - Good</option>
              <option value="used-fair">Used - Fair</option>
            </select>
            <div class="invalid-feedback" v-if="errors.condition">{{ errors.condition[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="location" class="form-label">Location</label>
            <input 
              type="text" 
              class="form-control" 
              id="location" 
              v-model="form.location" 
              :class="{'is-invalid': errors.location}"
              required
            >
            <div class="invalid-feedback" v-if="errors.location">{{ errors.location[0] }}</div>
          </div>

          <div class="mb-3">
            <label for="images" class="form-label">Images</label>
            <input 
              type="file" 
              class="form-control" 
              id="images" 
              multiple 
              @change="handleImageUpload"
              accept="image/*"
              :class="{'is-invalid': errors.images}"
            >
            <div class="invalid-feedback" v-if="errors.images">{{ errors.images[0] }}</div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Submitting...' : 'Add Listing' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';

export default {
  name: 'AddListing',
  setup() {
    const authStore = useAuthStore();
    const toast = useToast();
    const router = useRouter();
    return { authStore, toast, router };
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        price: '',
        categories: '',
        condition: '',
        location: '',
        images: []
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    handleImageUpload(event) {
      this.form.images = Array.from(event.target.files);
      this.errors.images = null; 
    },
    async submitListing() {
      try {
        this.loading = true;
        this.errors = {}; 
        
        // Convert price to number if it's a string
        const formData = {
          ...this.form,
          price: parseFloat(this.form.price)
        };

        await this.authStore.createListing(formData);
        
        this.toast.success('Listing added successfully!', {
          timeout: 3000,
        });
        
        this.router.push('/seller/listings');
      } catch (error) {
        console.error('Error adding listing:', error);
        
        if (error.response?.status === 422)
         {
          this.errors = error.response.data.errors;
          this.toast.error('Please correct the errors in the form.', {
            timeout: 5000,
          });
        } else {
          this.toast.error(error.response?.data?.message || 'Failed to add listing. Please try again.', {
            timeout: 5000,
          });
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.add-listing-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  padding: 15px 20px;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
}

.card-body {
  padding: 20px;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
  padding: 10px 20px;
}

.btn-primary:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #95a5a6;
  border-color: #95a5a6;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}
</style> 