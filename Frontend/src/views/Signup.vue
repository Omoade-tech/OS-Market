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
  
  <style scoped>
  .signup-page {
    min-height: 100vh;
    background-image: url('../assets/image/market-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
  }

  .signup-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .row {
    position: relative;
    z-index: 2;
  }

  .quote-container {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    max-width: 80%;
  }

  .quote-title {
    color: #333;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .quote-text {
    color: #555;
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  .quote-author {
    color: #666;
    text-align: right;
    font-weight: 500;
  }

  .signup-form {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }

  .form-label {
    font-weight: 500;
    color: #333;
  }

  .form-control, .form-select {
    border-radius: 5px;
    padding: 0.5rem;
  }

  .form-control:focus, .form-select:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    border-color: #80bdff;
  }

  .btn-primary {
    padding: 0.5rem 1rem;
    font-weight: 500;
  }

  .text-center a {
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .text-center a:hover {
    color: #0056b3;
  }

  @media (max-width: 768px) {
    .quote-container {
      display: none;
    }
    
    .signup-form {
      margin: 1rem;
    }
  }
  </style>