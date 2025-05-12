<template>
    <div class="container-fluid signup-page">
      <div class="row">
        <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <div class="quote-container">
            <h2 class="quote-title">Join Our Marketplace</h2>
            <p class="quote-text">"Start your journey with us today. Whether you're looking to sell your products or find great deals, our platform connects you with the right audience. Build your business, grow your network, and achieve your goals."</p>
            <div class="quote-author">- MarketPlace Team</div>
          </div>
        </div>
        <div class="col-md-6 d-flex align-items-center justify-content-center p-5">
          <div class="signup-form">
            <h2 class="text-center mb-4">Create Your Account</h2>
            <form @submit.prevent="handleRegister" novalidate>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="name" 
                    :class="{'is-invalid': submitted && !name}" 
                    autocomplete="name"
                    required 
                  />
                  <div class="invalid-feedback" v-if="submitted && !name">Name is required</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="email" 
                    :class="{'is-invalid': submitted && !isValidEmail}" 
                    autocomplete="email"
                    required 
                  />
                  <div class="invalid-feedback" v-if="submitted && !isValidEmail">Please enter a valid email address</div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    v-model="password" 
                    :class="{'is-invalid': submitted && !isValidPassword}" 
                    autocomplete="new-password"
                    required 
                  />
                  <div class="invalid-feedback" v-if="submitted && !isValidPassword">Password must be at least 8 characters long</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="confirmPassword" 
                    :class="{'is-invalid': submitted && !passwordsMatch}" 
                    autocomplete="new-password"
                    required 
                  />
                  <div class="invalid-feedback" v-if="submitted && !passwordsMatch">Passwords do not match</div>
                </div>
              </div>

              <div class="mb-3">
                <label for="role" class="form-label">Select Role</label>
                <select 
                  class="form-select" 
                  id="role" 
                  v-model="role" 
                  :class="{'is-invalid': submitted && !role}" 
                  required
                >
                  <option value="" disabled>Choose a role</option>
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
                <div class="invalid-feedback" v-if="submitted && !role">Please select a role</div>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">{{ errorMessage }}</div>
              
              <div class="text-center mt-3">
                Already have an account? <router-link to="/login" class="text-primary">Login</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth.js';
  import { useToast } from "vue-toastification";
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const toast = useToast();
      const authStore = useAuthStore();
      const router = useRouter();
      return { toast, authStore, router }
    },
    
    data() {
      return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        submitted: false,
        isLoading: false,
      };
    },
    
    computed: {
      isValidEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
      },
      isValidPassword() {
        return this.password.length >= 8;
      },
      passwordsMatch() {
        return this.password === this.confirmPassword;
      },
      errorMessage() {
        return this.authStore.error;
      }
    },
    
    methods: {
      async handleRegister() {
        this.submitted = true;
        this.authStore.clearError();
  
        if (!this.isValidEmail || !this.isValidPassword || !this.passwordsMatch || !this.name || !this.role) {
          return;
        }
  
        this.isLoading = true;
  
        try {
          const userData = {
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role
          };
          
          await this.authStore.register(userData);
  
          this.toast.success('Registration successful! Please login.', {
            timeout: 3000,
          });
          
          this.router.push('/login');
        } catch (error) {
          console.error('Registration error:', error);
          
          this.toast.error(this.authStore.error || 'Registration failed. Please try again.', {
            timeout: 5000,
          });
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>