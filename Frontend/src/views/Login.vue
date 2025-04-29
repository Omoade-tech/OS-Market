<template>
    <div class="container login-page">
      <div class="row">
        <div class="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <div class="quote-container">
            <h2 class="quote-title">Welcome to MarketPlace</h2>
            <p class="quote-text">"Your one-stop destination for buying and selling. Connect with buyers and sellers, discover amazing products, and grow your business."</p>
            <div class="quote-author">- MarketPlace Team</div>
          </div>
        </div>
        <div class="col-md-6 d-flex align-items-center justify-content-center p-5">
          <div class="login-card">
            <form @submit.prevent="handleLogin">
              <h2 class="text-center mb-3">Login</h2>
              <div class="form-group input-group mb-3">
                <label for="email"></label>
                <input type="text" id="email" v-model="email" class="form-control" placeholder="Enter your email" required>
                <i class="bi bi-person"></i>
              </div>
              <div class="form-group input-group mb-3">
                <label for="password"></label>
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="form-control" placeholder="Enter your password" required>
                <i class="bi bi-lock" v-if="!showPassword"></i>
                <i class="bi bi-unlock" v-if="showPassword"></i>
                <button @click="togglePasswordVisibility" type="button" class="btn btn-link">
                  <i class="bi bi-eye-slash" v-if="!showPassword"></i>
                  <i class="bi bi-eye" v-if="showPassword"></i>
                </button>
              </div>
              <div class="remember-me form-group">
                <input type="checkbox" v-model="rememberMe" id="rememberMe" />
                <label for="rememberMe">Remember Me</label>
              </div>
              <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
              <div class="text-center mt-3">
                <p class="mb-0">Don't have an account? <router-link to="/signup" class="text-primary">Create Account</router-link></p>
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
  
  export default {
    setup() {
      const toast = useToast();
      const authStore = useAuthStore();
      return { toast, authStore }
    },
    
    data() {
      return {
        email: '',
        password: '',
        rememberMe: false,
        showPassword: false,
        isLoading: false
      };
    },
    
    computed: {
      isAuthenticated() {
        return this.authStore.isAuthenticated;
      },
      currentUser() {
        return this.authStore.currentUser;
      }
    },
    
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
  
      async handleLogin() {
        try {
          this.isLoading = true;
          
          const credentials = {
            email: this.email,
            password: this.password
          };
          
          const response = await this.authStore.login(credentials);
          
          if (!response || !response.token) {
            throw new Error('No token received from server');
          }
          
          this.toast.success('Login successful!', {
            timeout: 3000,
          });
          
          // Redirect based on user role
          const userRole = this.authStore.userRole;
          
          if (userRole === 'admin') {
            this.$router.push('/admindashboard');
          } else if (userRole === 'seller') {
            this.$router.push('/sellerdashboard');
          } else {
            this.$router.push('/buyerdashboard');
          }
        } catch (error) {
          console.error('Login error:', error);
          
          let errorMessage = this.authStore.error || 'Login failed. Please check your credentials.';
          
          this.toast.error(errorMessage, {
            timeout: 5000,
          });
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-page {
    min-height: 100vh;
    background-image: url('../assets/image/market-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
  }

  .login-page::before {
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
  
  .login-card {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .input-group {
    position: relative;
  }
  
  .input-group i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .input-group button[type="button"] {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;
    padding: 0;
    font-size: 14px;
    cursor: pointer;
  }
  
  .input-group button[type="button"] i {
    font-size: 16px;
  }
  
  .remember-me {
    margin-bottom: 10px;
  }
  
  button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .quote-container {
      display: none;
    }
    
    .login-card {
      margin: 1rem;
    }
  }

  .text-center {
    margin-top: 1rem;
  }

  .text-center a {
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .text-center a:hover {
    color: #0056b3;
  }
  </style>