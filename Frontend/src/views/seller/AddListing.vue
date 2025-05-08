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
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input 
                type="number" 
                class="form-control" 
                id="price" 
                v-model="form.price" 
                step="0.01" 
                min="0"
                :class="{'is-invalid': errors.price}"
                required
              >
            </div>
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
              <option value="phones-gadgets">Phones & Gadgets</option>
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
            <label for="image" class="form-label">Image</label>
            <input 
              type="file" 
              class="form-control" 
              id="image" 
              @change="handleImageUpload"
              accept="image/jpeg,image/png,image/jpg"
              :class="{'is-invalid': errors.image}"
            >
            <div class="invalid-feedback" v-if="errors.image">{{ errors.image[0] }}</div>
            <small class="form-text text-muted">Accepted formats: JPG, JPEG, PNG</small>
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
        image: null
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          this.errors.image = ['Please upload a valid image file (JPG, JPEG, or PNG)'];
          event.target.value = '';
          return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          this.errors.image = ['Image size should not exceed 5MB'];
          event.target.value = '';
          return;
        }

        this.form.image = file;
        this.errors.image = null;
      }
    },
    validateForm() {
      const errors = {};
      
      if (!this.form.name.trim()) {
        errors.name = ['Name is required'];
      }
      
      if (!this.form.description.trim()) {
        errors.description = ['Description is required'];
      }
      
      if (!this.form.price || isNaN(this.form.price) || parseFloat(this.form.price) <= 0) {
        errors.price = ['Please enter a valid price'];
      }
      
      if (!this.form.categories) {
        errors.categories = ['Please select a category'];
      }
      
      if (!this.form.condition) {
        errors.condition = ['Please select a condition'];
      }
      
      if (!this.form.location.trim()) {
        errors.location = ['Location is required'];
      }

      return errors;
    },
    async submitListing() {
      try {
        // Clear previous errors
        this.errors = {};
        
        // Validate form
        const validationErrors = this.validateForm();
        if (Object.keys(validationErrors).length > 0) {
          this.errors = validationErrors;
          this.toast.error('Please correct the errors in the form.', {
            timeout: 5000,
          });
          return;
        }

        this.loading = true;
        
        // Create FormData object
        const formData = new FormData();
        
        // Log the form data before sending
        console.log('Form data before sending:', {
          name: this.form.name,
          description: this.form.description,
          price: this.form.price,
          categories: this.form.categories,
          condition: this.form.condition,
          location: this.form.location,
          hasImage: !!this.form.image
        });

        // Ensure all required fields are present and properly formatted
        formData.append('name', this.form.name.trim());
        formData.append('description', this.form.description.trim());
        formData.append('price', parseFloat(this.form.price));
        formData.append('categories', this.form.categories);
        formData.append('condition', this.form.condition);
        formData.append('location', this.form.location.trim());
        
        // Only append image if it exists
        if (this.form.image instanceof File) {
          formData.append('image', this.form.image);
        }

        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        const response = await this.authStore.createListing(formData);
        
        this.toast.success('Listing added successfully!', {
          timeout: 3000,
        });
        
        this.router.push('/seller/listings');
      } catch (error) {
        console.error('Error adding listing:', error);
        
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors;
          console.log('Validation errors:', error.response.data.errors);
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
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.card-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem;
  transition: border-color 0.2s;
}

.form-control:focus, .form-select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.btn-primary {
  background-color: #4a90e2;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Media Queries */
@media (max-width: 768px) {
  .add-listing-container {
    margin: 1rem auto;
  }

  .card-header {
    padding: 1rem;
  }

  .card-header h4 {
    font-size: 1.25rem;
  }

  .card-body {
    padding: 1rem;
  }

  .form-control, .form-select {
    padding: 0.5rem;
  }

  .btn-primary {
    width: 100%;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .add-listing-container {
    margin: 2.9rem auto;
    padding: 0 0.5rem;
  }

  .card-header {
    padding: 0.75rem;
  }

  .card-body {
    padding: 0.75rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-control, .form-select {
    font-size: 0.9rem;
  }

  .input-group-text {
    font-size: 0.9rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1a1a1a;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .card-header {
    border-bottom-color: #333;
  }

  .card-header h4 {
    color: #fff;
  }

  .form-label {
    color: #fff;
  }

  .form-control, .form-select {
    background-color: #2a2a2a;
    border-color: #333;
    color: #fff;
  }

  .form-control:focus, .form-select:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }

  .input-group-text {
    background-color: #2a2a2a;
    border-color: #333;
    color: #fff;
  }
}
</style> 