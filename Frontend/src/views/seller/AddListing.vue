<template>
  <div class="add-listing-container">
    <div class="page-header">
      <h2>Add New Listing</h2>
      <p class="subtitle">Create a new listing to showcase your items to potential buyers</p>
      </div>

    <div class="listing-form-container">
      <div class="form-card">
        <form @submit.prevent="submitListing">
          <!-- Basic Information Section -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-info-circle"></i>
              Basic Information
            </h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="name" class="form-label">Item Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="form.name" 
              :class="{'is-invalid': errors.name}"
                  placeholder="Enter item name"
              required
            >
            <div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
          </div>

              <div class="form-group">
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
                    placeholder="0.00"
                :class="{'is-invalid': errors.price}"
                required
              >
            </div>
            <div class="invalid-feedback" v-if="errors.price">{{ errors.price[0] }}</div>
          </div>
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description</label>
              <textarea 
                class="form-control" 
                id="description" 
                v-model="form.description" 
                rows="4" 
                :class="{'is-invalid': errors.description}"
                placeholder="Describe your item in detail..."
                required
              ></textarea>
              <div class="invalid-feedback" v-if="errors.description">{{ errors.description[0] }}</div>
            </div>
          </div>

          <!-- Category and Condition Section -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-tags"></i>
              Category & Condition
            </h3>
            
            <div class="form-grid">
              <div class="form-group">
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

              <div class="form-group">
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
            </div>
          </div>

          <!-- Location Section -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-map-marker-alt"></i>
              Location
            </h3>
            
            <div class="form-group">
              <label for="location" class="form-label">Item Location</label>
            <input 
              type="text" 
              class="form-control" 
              id="location" 
              v-model="form.location" 
              :class="{'is-invalid': errors.location}"
                placeholder="Enter item location"
              required
            >
            <div class="invalid-feedback" v-if="errors.location">{{ errors.location[0] }}</div>
          </div>
          </div>

          <!-- Image Upload Section -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-image"></i>
              Images
            </h3>
            
            <div class="image-upload-container">
              <div class="upload-area" 
                   :class="{'has-image': form.image}"
                   @click="triggerFileInput"
                   @dragover.prevent
                   @drop.prevent="handleDrop">
            <input 
              type="file" 
                  ref="fileInput"
                  class="file-input" 
              @change="handleImageUpload"
              accept="image/jpeg,image/png,image/jpg"
              :class="{'is-invalid': errors.image}"
            >
                <div class="upload-content" v-if="!form.image">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Drag & drop your image here or click to browse</p>
                  <small>Accepted formats: JPG, JPEG, PNG (max 5MB)</small>
                </div>
                <div class="preview-content" v-else>
                  <img :src="imagePreview" alt="Preview" class="image-preview">
                  <button type="button" class="btn btn-danger btn-sm remove-image" @click.stop="removeImage">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            <div class="invalid-feedback" v-if="errors.image">{{ errors.image[0] }}</div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="resetForm">
              <i class="fas fa-undo"></i> Reset
            </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-plus'"></i>
            {{ loading ? 'Submitting...' : 'Add Listing' }}
          </button>
          </div>
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
      loading: false,
      imagePreview: null
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.processImageFile(file);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.processImageFile(file);
      }
    },
    processImageFile(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          this.errors.image = ['Please upload a valid image file (JPG, JPEG, or PNG)'];
          return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          this.errors.image = ['Image size should not exceed 5MB'];
          return;
        }

        this.form.image = file;
        this.errors.image = null;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.form.image = null;
      this.imagePreview = null;
      this.$refs.fileInput.value = '';
    },
    resetForm() {
      this.form = {
        name: '',
        description: '',
        price: '',
        categories: '',
        condition: '',
        location: '',
        image: null
      };
      this.errors = {};
      this.imagePreview = null;
      this.$refs.fileInput.value = '';
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
        
        // Add form fields to FormData
        formData.append('name', this.form.name.trim());
        formData.append('description', this.form.description.trim());
        formData.append('price', parseFloat(this.form.price));
        formData.append('categories', this.form.categories);
        formData.append('condition', this.form.condition);
        formData.append('location', this.form.location.trim());
        
        if (this.form.image instanceof File) {
          formData.append('image', this.form.image);
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.listing-form-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-card {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #3498db;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.form-select {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.image-upload-container {
  margin-top: 1rem;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #3498db;
  background-color: #f8f9fa;
}

.upload-area.has-image {
  border-style: solid;
  padding: 0;
}

.file-input {
  display: none;
}

.upload-content {
  color: #666;
}

.upload-content i {
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 1rem;
}

.preview-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.5rem;
  border-radius: 50%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}

.btn-primary:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  border-color: #95a5a6;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  border-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.btn-danger:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}

.invalid-feedback {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #e74c3c !important;
}

.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25) !important;
}

@media (max-width: 768px) {
  .add-listing-container {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: 1rem;
  }

  .page-header h2 {
    font-size: 2rem;
  }
}
</style> 