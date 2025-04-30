<template>
    <div class="container mb-3">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">User Details</div>
  
            <!-- Loading state -->
            <div class="card-body" v-if="loading">
              <div class="text-center">
                <p>Loading profile...</p>
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
  
            <!-- Error state -->
            <div class="card-body" v-else-if="error">
              <div class="alert alert-danger">
                <strong>Error:</strong> {{ error }}
                <div v-if="isAuthError">
                  <p>You may need to login again.</p>
                  <button class="btn btn-primary" @click="redirectToLogin">Go to Login</button>
                </div>
              </div>
            </div>
  
            <!-- Success state -->
            <div class="card-body" v-else-if="user">
              <div class="row">
                <!-- User image -->
                <div class="col-md-4" v-if="user.image">
                  <img :src="user.image" alt="User Image" class="img-fluid">
                </div>
                <div class="col-md-8">
                  <h5>Name: {{ user.name }}</h5>
                  <p>Email: {{ user.email }}</p>
                  <p>Role: <span class="badge bg-primary">{{ user.role }}</span></p>
                  <p v-if="user.phoneNumber">Phone Number: {{ user.phoneNumber }}</p>
                  <p v-if="user.age">Age: {{ user.age }}</p>
                  <p v-if="user.sex">Sex: {{ user.sex }}</p>
                  <p v-if="user.status">Status: {{ user.status }}</p>
                  <p v-if="user.address">Address: {{ user.address }}</p>
                  <p v-if="user.city">City: {{ user.city }}</p>
                  <p v-if="user.state">State: {{ user.state }}</p>
                  <p v-if="user.country">Country: {{ user.country }}</p>
  
                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-success" @click="openEditModal">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- No user data -->
            <div class="card-body" v-else>
              <div class="alert alert-warning">
                <p>No profile data available.</p>
                <button class="btn btn-primary" @click="fetchUserProfile">Try Again</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Profile Modal -->
      <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editProfileModalLabel">Edit Profile</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="profileForm" @submit.prevent="submitProfileUpdate">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" v-model="profileForm.name" required>
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="profileForm.email" required>
                  </div>
                </div>
  
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
                      <option value="married">Married</option>
                      <option value="single">Single</option>
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
  
                <div class="mb-3">
                  <label for="profileImage" class="form-label">Profile Image</label>
                  <input type="file" class="form-control" id="profileImage" @change="handleImageUpload" accept="image/*">
                  <div class="form-text">Maximum file size: 2MB. Supported formats: JPG, PNG</div>
                </div>
  
                <div v-if="updateError" class="alert alert-danger mb-3">
                  {{ updateError }}
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="submitProfileUpdate" :disabled="updating">
                <span v-if="updating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Save Changes
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
      const modalElement = document.getElementById('editProfileModal');
      if (modalElement) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
    },
    setup() {
      const router = useRouter();
      const toast = useToast();
      const authStore = useAuthStore();
      return { router, toast, authStore };
    },
    methods: {
      async fetchUserProfile() {
        this.loading = true;
        this.error = null;
        this.isAuthError = false;
  
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.error = 'No authentication token found. Please log in.';
            this.isAuthError = true;
            this.loading = false;
            return;
          }
  
          const authStore = useAuthStore();
          await authStore.fetchUserProfile();
          this.user = { ...authStore.user };
          if (!this.user) {
            this.error = 'Failed to load user profile data.';
          } else {
            this.initializeProfileForm();
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          this.error = error.response?.data?.message || error.message || 'Failed to load profile.';
          if (error.response && error.response.status === 401) {
            this.isAuthError = true;
          }
        } finally {
          this.loading = false;
        }
      },
  
      initializeProfileForm() {
        if (!this.user) return;
  
        console.log('Initializing profile form with user data:', this.user);
  
        this.profileForm = {
          name: this.user.name || '',
          email: this.user.email || '',
          phoneNumber: this.user.phoneNumber || '',
          age: this.user.age || '',
          sex: this.user.sex || '',
          status: this.user.status || '',
          address: this.user.address || '',
          city: this.user.city || '',
          state: this.user.state || '',
          country: this.user.country || '',
          image: null
        };
  
        console.log('Profile form initialized:', this.profileForm);
      },
  
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            this.updateError = 'Image size should not exceed 2MB';
            event.target.value = '';
            return;
          }
  
          if (!file.type.match('image.*')) {
            this.updateError = 'Please select an image file';
            event.target.value = '';
            return;
          }
  
          this.profileForm.image = file;
          this.updateError = null;
          console.log('Selected image:', file);
        }
      },
  
      openEditModal() {
        this.initializeProfileForm();
        this.updateError = null;
  
        if (this.modalInstance) {
          this.modalInstance.show();
        } else {
          const modalElement = document.getElementById('editProfileModal');
          if (modalElement) {
            this.modalInstance = new bootstrap.Modal(modalElement);
            this.modalInstance.show();
          }
        }
      },
  
      async submitProfileUpdate() {
        this.updating = true;
        this.updateError = null;
  
        try {
          // Log the form data before validation
          console.log('Profile form data before validation:', this.profileForm);
  
          // Validate required fields first
          if (!this.profileForm.name?.trim()) {
            throw new Error('Name is required');
          }
          if (!this.profileForm.email?.trim()) {
            throw new Error('Email is required');
          }
  
          // Create a clean data object with only the fields we want to send
          const updateData = {
            name: this.profileForm.name.trim(),
            email: this.profileForm.email.trim(),
            status: this.profileForm.status || null // Explicitly include status
          };
  
          // Add other fields only if they have values
          Object.keys(this.profileForm).forEach(key => {
            if (key !== 'name' && key !== 'email' && key !== 'image' && key !== 'status' && 
                this.profileForm[key] !== null && this.profileForm[key] !== '') {
              updateData[key] = this.profileForm[key];
            }
          });
  
          // Log the data being sent
          console.log('Data being sent to server:', updateData);
  
          const authStore = useAuthStore();
          const response = await authStore.updateProfile(updateData);
  
          if (response) {
            // Update the local user data
            this.user = { ...response };
            
            // Update the auth store
            authStore.user = { ...response };
            localStorage.setItem('user', JSON.stringify(response));
  
            this.toast.success('Profile updated successfully!', {
              timeout: 3000,
            });
  
            // Clear file input
            const fileInput = document.getElementById('profileImage');
            if (fileInput) {
              fileInput.value = '';
            }
  
            if (this.modalInstance) {
              this.modalInstance.hide();
            }
  
            // Refresh the profile data
            await this.fetchUserProfile();
          } else {
            throw new Error('Failed to update profile');
          }
        } catch (error) {
          console.error('Profile update error:', error);
          if (error.response?.data?.errors) {
            console.error('Validation errors:', error.response.data.errors);
            // Show specific validation errors
            const errorMessages = Object.entries(error.response.data.errors)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('\n');
            this.updateError = errorMessages;
          } else {
            this.updateError = error.response?.data?.message || error.message || 'Failed to update profile. Please try again.';
          }
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
  .card {
    margin-top: 20px;
  }
  
  .card-header {
    background-color: #f7f7f7;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .img-fluid {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
  
  .alert {
    margin-bottom: 0;
  }
  
  .badge {
    font-size: 0.9em;
    padding: 0.5em 0.8em;
  }
  </style>