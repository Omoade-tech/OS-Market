<template>
  <div class="container-fluid login-page">
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
        
        // Get user role from the response
        const userRole = response.user.role;
        
        // Redirect based on user role
        switch (userRole) {
          case 'admin':
            await this.router.push('/admindashboard');
            break;
          case 'seller':
            await this.router.push('/seller/dashboard');
            break;
          case 'buyer':
            await this.router.push('/buyerdashboard');
            break;
          default:
            await this.router.push('/');
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
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../assets/image/market-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
}

.row {
  position: relative;
  z-index: 2;
  width: 100%;
  margin: 0;
}

.quote-container {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  margin: 2rem;
  transition: transform 0.3s ease;
}

.quote-container:hover {
  transform: translateY(-5px);
}

.quote-title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
}

.quote-text {
  color: #34495e;
  font-size: 1.3rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-style: italic;
}

.quote-author {
  color: #7f8c8d;
  text-align: right;
  font-weight: 600;
  font-size: 1.1rem;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.98);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  margin: 2rem;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.login-card h2 {
  color: #2c3e50;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group input {
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.input-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.input-group i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  font-size: 1.2rem;
}

.input-group button[type="button"] {
  position: absolute;
  right: 45px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: 1rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.input-group button[type="button"]:hover {
  color: #3498db;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me input[type="checkbox"] {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  accent-color: #3498db;
}

.remember-me label {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: #3498db;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.text-center {
  margin-top: 1.5rem;
}

.text-center p {
  color: #7f8c8d;
  font-size: 1rem;
}

.text-center a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.text-center a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .quote-container {
    display: none;
  }
  
  .login-card {
    margin: 1rem;
    padding: 2rem;
  }

  .login-card h2 {
    font-size: 1.8rem;
  }

  .input-group input {
    padding: 0.8rem 1.2rem;
  }
}

/* Loading spinner styles */
.spinner-border {
  width: 1.2rem;
  height: 1.2rem;
  border-width: 0.2em;
}
</style>