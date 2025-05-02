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