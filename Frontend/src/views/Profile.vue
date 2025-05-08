<template>
  <div class="container profile-container mt-5">
    <div class="card profile-card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">User Profile</h5>
      </div>

      <!-- Loading state -->
      <div class="card-body" v-if="loading">
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading profile...</p>
        </div>
      </div>

      <!-- Error state -->
      <div class="card-body" v-else-if="error">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          <strong>Error:</strong> {{ error }}
          <div v-if="isAuthError" class="mt-2">
            <p>You may need to login again.</p>
            <button class="btn btn-primary" @click="redirectToLogin">Go to Login</button>
          </div>
        </div>
      </div>

      <!-- Success state -->
      <div class="card-body" v-else-if="user">
        <div class="profile-content">
          <!-- Profile Image Section -->
          <div class="profile-image-section text-center mb-4">
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
          </div>

          <!-- User Details Section -->
          <div class="user-details">
            <h4 class="user-name mb-3">{{ user.name }}</h4>
            <div class="detail-item">
              <i class="fas fa-envelope text-primary"></i>
              <span>{{ user.email }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-user-tag text-primary"></i>
              <span class="badge bg-primary">{{ user.role }}</span>
            </div>
            <div class="detail-item" v-if="user.phoneNumber">
              <i class="fas fa-phone text-primary"></i>
              <span>{{ user.phoneNumber }}</span>
            </div>
            <div class="detail-item" v-if="user.age">
              <i class="fas fa-birthday-cake text-primary"></i>
              <span>{{ user.age }} years old</span>
            </div>
            <div class="detail-item" v-if="user.sex">
              <i class="fas fa-venus-mars text-primary"></i>
              <span>{{ user.sex }}</span>
            </div>
            <div class="detail-item" v-if="user.status">
              <i class="fas fa-heart text-primary"></i>
              <span>{{ user.status }}</span>
            </div>
            <div class="detail-item" v-if="user.address">
              <i class="fas fa-map-marker-alt text-primary"></i>
              <span>{{ user.address }}</span>
            </div>
            <div class="detail-item" v-if="user.city">
              <i class="fas fa-city text-primary"></i>
              <span>{{ user.city }}</span>
            </div>
            <div class="detail-item" v-if="user.state">
              <i class="fas fa-map text-primary"></i>
              <span>{{ user.state }}</span>
            </div>
            <div class="detail-item" v-if="user.country">
              <i class="fas fa-globe text-primary"></i>
              <span>{{ user.country }}</span>
            </div>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-primary" @click="openEditModal">
              <i class="fas fa-edit me-2"></i>Edit Profile
            </button>
          </div>
        </div>
      </div>

      <!-- No user data -->
      <div class="card-body" v-else>
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <p class="mb-0">No profile data available.</p>
          <button class="btn btn-primary mt-2" @click="fetchUserProfile">Try Again</button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="editProfileModalLabel">
              <i class="fas fa-user-edit me-2"></i>Edit Profile
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="profileForm" @submit.prevent="submitProfileUpdate">
              <!-- Existing form fields with updated styling -->
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

              <!-- Rest of the form fields with similar styling -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="phoneNumber" class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" id="phoneNumber" v-model="profileForm.phoneNumber">
                </div>
                <div class="col-md-6">
                  <label for="age" class="form-label">Age</label>
                  <input type="number" class="form-control" id="age" v-model="profileForm.age" min="1" max="120">
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="sex" class="form-label">Sex</label>
                  <select class="form-select" id="sex" v-model="profileForm.sex">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status" v-model="profileForm.status">
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <input type="text" class="form-control" id="address" v-model="profileForm.address">
              </div>

              <div class="mb-3">
                <label for="city" class="form-label">City</label>
                <input type="text" class="form-control" id="city" v-model="profileForm.city">
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="state" class="form-label">State</label>
                  <input type="text" class="form-control" id="state" v-model="profileForm.state">
                </div>
                <div class="col-md-6">
                  <label for="country" class="form-label">Country</label>
                  <input type="text" class="form-control" id="country" v-model="profileForm.country">
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
      console.log('Selected file:', file);
      console.log('File type:', file?.type);
      console.log('File size:', file?.size);
      
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        console.log('Valid types:', validTypes);
        console.log('File type check:', validTypes.includes(file.type));
        
        if (!validTypes.includes(file.type)) {
          this.toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF image.', {
            timeout: 5000,
          });
          event.target.value = ''; // Clear the file input
          return;
        }

        // Validate file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        console.log('File size check:', file.size <= maxSize);
        
        if (file.size > maxSize) {
          this.toast.error('File size too large. Maximum size is 2MB.', {
            timeout: 5000,
          });
          event.target.value = ''; // Clear the file input
          return;
        }

        // Create a new File object to ensure proper type
        const imageFile = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });
        
        console.log('Created image file:', imageFile);
        console.log('Image file type:', imageFile.type);
        console.log('Image file instanceof File:', imageFile instanceof File);
        console.log('Image file instanceof Blob:', imageFile instanceof Blob);

        this.profileForm.image = imageFile;
      }
    },

    async submitProfileUpdate() {
      this.updating = true;
      this.updateError = null;

      try {
        // Create a copy of the form data to avoid modifying the original
        const formData = { ...this.profileForm };
        
        // Ensure required fields are present
        if (!formData.name || !formData.email) {
          this.toast.error('Name and email are required fields', {
            timeout: 5000,
          });
          return;
        }

        const response = await this.authStore.updateProfile(formData);
        this.user = response;
        this.modalInstance.hide();
        this.toast.success('Profile updated successfully!', {
          timeout: 3000,
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        this.updateError = error.message || 'Failed to update profile';
        this.toast.error(this.updateError, {
          timeout: 5000,
        });
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
  padding: 20px;
}

.profile-card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  padding: 1rem;
}

.profile-image-section {
  position: relative;
}

.profile-image-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
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
}

.user-details {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.user-name {
  color: #2c3e50;
  font-weight: 600;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.detail-item i {
  width: 24px;
  margin-right: 12px;
}

.detail-item span {
  color: #2c3e50;
}

.badge {
  padding: 6px 12px;
  font-weight: 500;
}

.btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-content {
  border-radius: 15px;
  border: none;
}

.modal-header {
  border-radius: 15px 15px 0 0;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .profile-image-container {
    width: 120px;
    height: 120px;
  }
  
  .user-details {
    padding: 15px;
  }
}
</style>