<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="card-header">
        <h5><i class="fas fa-user-circle me-2"></i>User Profile</h5>
      </div>

      <!-- Loading state -->
      <div class="card-body" v-if="loading">
        <div class="loading-container">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="loading-text">Loading profile...</p>
        </div>
      </div>

      <!-- Error state -->
      <div class="card-body" v-else-if="error">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          <strong>Error:</strong> {{ error }}
          <div v-if="isAuthError" class="mt-3">
            <p>You may need to login again.</p>
            <button class="btn btn-primary" @click="redirectToLogin">
              <i class="fas fa-sign-in-alt me-2"></i>Go to Login
            </button>
          </div>
        </div>
      </div>

      <!-- Success state -->
      <div class="card-body" v-else-if="user">
        <div class="profile-content">
          <!-- Profile Image Section -->
          <div class="profile-image-section">
            <div class="profile-image-container">
              <img 
                :src="user.image || '/default-avatar.png'" 
                alt="Profile Image" 
                class="profile-image"
                @error="handleImageError"
              >
              <div class="image-overlay">
                <label for="profileImage" class="upload-btn">
                  <i class="fas fa-camera"></i>
                </label>
                <input 
                  type="file" 
                  id="profileImage" 
                  class="d-none" 
                  @change="handleImageUpload" 
                  accept="image/*"
                >
              </div>
            </div>
            <div class="profile-status">
              <span class="status-badge" :class="user.status?.toLowerCase()">
                {{ user.status || 'Active' }}
              </span>
            </div>
            <!-- Add dedicated upload button -->
            <div class="upload-button-container">
              <label for="profileImage" class="btn btn-outline-primary upload-button">
                <i class="fas fa-upload me-2"></i>Upload New Photo
              </label>
            </div>
          </div>

          <!-- User Details Section -->
          <div class="user-details">
            <h4 class="user-name">{{ user.name }}</h4>
            
            <div class="details-grid">
            <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <div class="detail-content">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">{{ user.email }}</span>
                </div>
            </div>

            <div class="detail-item">
                <i class="fas fa-user-tag"></i>
                <div class="detail-content">
                  <span class="detail-label">Role</span>
                  <span class="badge bg-primary">{{ user.role }}</span>
                </div>
            </div>

            <div class="detail-item" v-if="user.phoneNumber">
                <i class="fas fa-phone"></i>
                <div class="detail-content">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ user.phoneNumber }}</span>
                </div>
            </div>

            <div class="detail-item" v-if="user.age">
                <i class="fas fa-birthday-cake"></i>
                <div class="detail-content">
                  <span class="detail-label">Age</span>
                  <span class="detail-value">{{ user.age }} years old</span>
                </div>
            </div>

            <div class="detail-item" v-if="user.sex">
                <i class="fas fa-venus-mars"></i>
                <div class="detail-content">
                  <span class="detail-label">Gender</span>
                  <span class="detail-value">{{ user.sex }}</span>
            </div>
            </div>

            <div class="detail-item" v-if="user.address">
                <i class="fas fa-map-marker-alt"></i>
                <div class="detail-content">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">{{ user.address }}</span>
                </div>
            </div>

            <div class="detail-item" v-if="user.city">
                <i class="fas fa-city"></i>
                <div class="detail-content">
                  <span class="detail-label">City</span>
                  <span class="detail-value">{{ user.city }}</span>
                </div>
            </div>

            <div class="detail-item" v-if="user.state">
                <i class="fas fa-map"></i>
                <div class="detail-content">
                  <span class="detail-label">State</span>
                  <span class="detail-value">{{ user.state }}</span>
                </div>
            </div>

            <div class="detail-item" v-if="user.country">
                <i class="fas fa-globe"></i>
                <div class="detail-content">
                  <span class="detail-label">Country</span>
                  <span class="detail-value">{{ user.country }}</span>
                </div>
              </div>
          </div>

            <div class="profile-actions">
            <button class="btn btn-primary" @click="openEditModal">
              <i class="fas fa-edit me-2"></i>Edit Profile
            </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No user data -->
      <div class="card-body" v-else>
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <p class="mb-0">No profile data available.</p>
          <button class="btn btn-primary mt-3" @click="fetchUserProfile">
            <i class="fas fa-sync-alt me-2"></i>Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfileModalLabel">
              <i class="fas fa-user-edit me-2"></i>Edit Profile
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="profileForm" @submit.prevent="submitProfileUpdate">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="name" class="form-label">Name</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                    <input type="text" class="form-control" id="name" v-model="profileForm.name" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                    <input type="email" class="form-control" id="email" v-model="profileForm.email" required>
                  </div>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="phoneNumber" class="form-label">Phone Number</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-phone"></i></span>
                  <input type="tel" class="form-control" id="phoneNumber" v-model="profileForm.phoneNumber">
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="age" class="form-label">Age</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-birthday-cake"></i></span>
                  <input type="number" class="form-control" id="age" v-model="profileForm.age" min="1" max="120">
                  </div>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="sex" class="form-label">Gender</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-venus-mars"></i></span>
                  <select class="form-select" id="sex" v-model="profileForm.sex">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="status" class="form-label">Status</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-heart"></i></span>
                  <select class="form-select" id="status" v-model="profileForm.status">
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                <input type="text" class="form-control" id="address" v-model="profileForm.address">
              </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="city" class="form-label">City</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-city"></i></span>
                    <input type="text" class="form-control" id="city" v-model="profileForm.city">
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="state" class="form-label">State</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-map"></i></span>
                  <input type="text" class="form-control" id="state" v-model="profileForm.state">
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="country" class="form-label">Country</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-globe"></i></span>
                  <input type="text" class="form-control" id="country" v-model="profileForm.country">
                  </div>
                </div>
              </div>

              <div v-if="updateError" class="alert alert-danger mb-3">
                <i class="fas fa-exclamation-circle me-2"></i>
                {{ updateError }}
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="submitProfileUpdate" :disabled="updating">
              <span v-if="updating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i class="fas fa-save me-2"></i>Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as bootstrap from 'bootstrap';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const toast = useToast();
    return { authStore, router, toast }
  },

  data() {
    return {
      user: null,
      loading: true,
      error: null,
      isAuthError: false,
      updating: false,
      updateError: null,
      profileForm: {
        name: '',
        email: '',
        phoneNumber: '',
        age: '',
        sex: '',
        status: '',
        address: '',
        city: '',
        state: '',
        country: '',
        image: null
      },
      modalInstance: null
    };
  },

  created() {
    this.fetchUserProfile();
  },

  mounted() {
    this.modalInstance = new bootstrap.Modal(document.getElementById('editProfileModal'));
  },

  methods: {
    async fetchUserProfile() {
      this.loading = true;
      this.error = null;
      this.isAuthError = false;

      try {
        const response = await this.authStore.fetchUserProfile();
        this.user = response;
        this.profileForm = { ...response };
      } catch (error) {
        console.error('Error fetching profile:', error);
        this.error = error.message || 'Failed to fetch profile';
        this.isAuthError = error.response?.status === 401;
      } finally {
        this.loading = false;
      }
    },

    openEditModal() {
      this.profileForm = { ...this.user };
      this.modalInstance.show();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        
        if (!validTypes.includes(file.type)) {
          this.toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF image.', {
            timeout: 5000,
          });
          event.target.value = ''; 
          return;
        }

        // Validate file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        
        if (file.size > maxSize) {
          this.toast.error('File size too large. Maximum size is 2MB.', {
            timeout: 5000,
          });
          event.target.value = ''; 
          return;
        }

        // Create a preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          // Update the user object with the preview URL
          this.user = {
            ...this.user,
            image: e.target.result
          };
        };
        reader.readAsDataURL(file);

        // Store the file in the form
        this.profileForm.image = file;

        // Automatically submit the profile update
        this.submitProfileUpdate();
      }
    },

    handleImageError() {
      // Set default image if the current image fails to load
      this.user.image = '/default-avatar.png';
    },

    async submitProfileUpdate() {
      this.updating = true;
      this.updateError = null;

      try {
        // Create FormData object for multipart/form-data
        const formData = new FormData();
        
        // Log initial form data
        console.log('Initial profileForm data:', this.profileForm);
        
        // Add all form fields to FormData
        Object.keys(this.profileForm).forEach(key => {
          if (key === 'image' && this.profileForm[key] instanceof File) {
            formData.append('image', this.profileForm[key]);
            console.log('Adding image file:', {
              name: this.profileForm[key].name,
              type: this.profileForm[key].type,
              size: this.profileForm[key].size
            });
          } else if (key !== 'image') {
            const value = this.profileForm[key] || this.user[key] || '';
            formData.append(key, value);
            console.log(`Adding field ${key}:`, value);
          }
        });

        // Log complete FormData contents
        console.log('Complete FormData contents:');
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        
        // Ensure required fields are present
        if (!formData.get('name') || !formData.get('email')) {
          console.error('Missing required fields:', {
            name: formData.get('name'),
            email: formData.get('email')
          });
          this.toast.error('Name and email are required fields', {
            timeout: 5000,
          });
          return;
        }

        console.log('Sending profile update request...');
        const response = await this.authStore.updateProfile(formData);
        console.log('Profile update response:', response);
        
        this.user = response;
        this.modalInstance.hide();
        this.toast.success('Profile updated successfully!', {
          timeout: 3000,
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        
        // Enhanced error logging
        if (error.response) {
          console.error('Error response details:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
          });
        }
        
        // Handle validation errors
        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors;
          console.error('Validation errors:', validationErrors);
          
          if (validationErrors) {
            // Show each validation error
            Object.keys(validationErrors).forEach(field => {
              console.error(`Validation error for ${field}:`, validationErrors[field]);
              this.toast.error(`${field}: ${validationErrors[field].join(', ')}`, {
                timeout: 5000,
              });
            });
          } else {
            console.error('Validation failed without specific errors:', error.response.data);
            this.toast.error(error.response.data.message || 'Validation failed', {
              timeout: 5000,
            });
          }
        } else {
          console.error('Non-validation error:', error.message);
          this.toast.error(error.response?.data?.message || error.message || 'Failed to update profile', {
            timeout: 5000,
          });
        }
        
        this.updateError = error.response?.data?.message || error.message || 'Failed to update profile';
      } finally {
        this.updating = false;
      }
    },

    redirectToLogin() {
      this.router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.profile-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #ffffff;
}

.card-header {
  background: linear-gradient(135deg, #3498db, #2980b9) !important;
  padding: 1.5rem;
  border-bottom: none;
}

.card-header h5 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.profile-content {
  padding: 2rem;
}

.profile-image-section {
  position: relative;
  margin-bottom: 3rem;
}

.profile-image-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 5px solid #ffffff;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-image-container:hover .image-overlay {
  opacity: 1;
}

.upload-btn {
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.upload-btn:hover {
  transform: scale(1.1);
}

.user-details {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.user-name {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;
}

.user-name::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 3px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.detail-item:hover {
  transform: translateX(5px);
  background: #f0f8ff;
}

.detail-item i {
  font-size: 1.2rem;
  margin-right: 1rem;
  width: 24px;
  text-align: center;
}

.detail-item span {
  color: #2c3e50;
  font-size: 1.1rem;
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 20px;
}

/* Modal Styles */
.modal-content {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  background: linear-gradient(135deg, #3498db, #2980b9) !important;
  border-bottom: none;
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 600;
}

.form-label {
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #3498db;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

/* Loading and Error States */
.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #3498db;
}

.alert {
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
}

.alert-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.alert-warning {
  background-color: #fef3c7;
  color: #d97706;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-content {
    padding: 1rem;
  }

  .profile-image-container {
    width: 150px;
    height: 150px;
  }

  .user-name {
    font-size: 1.5rem;
  }

  .detail-item {
    padding: 0.75rem;
  }

  .detail-item span {
    font-size: 1rem;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loading-text {
  margin-top: 1rem;
  color: #666;
  font-size: 1.1rem;
}

.profile-status {
  text-align: center;
  margin-top: 1rem;
}

.status-badge {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background-color: #2ecc71;
  color: white;
}

.status-badge.inactive {
  background-color: #e74c3c;
  color: white;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
}

.profile-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .profile-actions .btn {
    width: 100%;
  }
}

.upload-button-container {
  text-align: center;
  margin-top: 1rem;
}

.upload-button {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}
</style>