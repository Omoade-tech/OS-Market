<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-left">
        <div class="quote-container">
          <div class="animated-text">
            <h2 class="quote-title">Join Our Marketplace</h2>
            <p class="quote-text">"Start your journey with us today. Whether you're looking to sell your products or find great deals, our platform connects you with the right audience. Build your business, grow your network, and achieve your goals."</p>
            <div class="quote-author">- MarketPlace Team</div>
          </div>
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
        </div>
      </div>
      <div class="signup-right">
        <div class="signup-form-container">
          <div class="form-header">
            <h2>Create Your Account</h2>
            <p class="subtitle">Join our community of buyers and sellers</p>
          </div>
          <form @submit.prevent="handleRegister" novalidate class="signup-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Full Name</label>
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="name" 
                    :class="{'is-invalid': submitted && !name}" 
                    autocomplete="name"
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
                <div class="invalid-feedback" v-if="submitted && !name">Name is required</div>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-wrapper">
                  <i class="fas fa-envelope input-icon"></i>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="email" 
                    :class="{'is-invalid': submitted && !isValidEmail}" 
                    autocomplete="email"
                    placeholder="Enter your email"
                    required 
                  />
                </div>
                <div class="invalid-feedback" v-if="submitted && !isValidEmail">Please enter a valid email address</div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                  <i class="fas fa-lock input-icon"></i>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    v-model="password" 
                    :class="{'is-invalid': submitted && !isValidPassword}" 
                    autocomplete="new-password"
                    placeholder="Create a password"
                    required 
                  />
                </div>
                <div class="invalid-feedback" v-if="submitted && !isValidPassword">Password must be at least 8 characters long</div>
              </div>
              <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-wrapper">
                  <i class="fas fa-lock input-icon"></i>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="confirmPassword" 
                    :class="{'is-invalid': submitted && !passwordsMatch}" 
                    autocomplete="new-password"
                    placeholder="Confirm your password"
                    required 
                  />
                </div>
                <div class="invalid-feedback" v-if="submitted && !passwordsMatch">Passwords do not match</div>
              </div>
            </div>

            <div class="form-group">
              <label for="role" class="form-label">Select Role</label>
              <div class="input-wrapper">
                <i class="fas fa-user-tag input-icon"></i>
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
              </div>
              <div class="invalid-feedback" v-if="submitted && !role">Please select a role</div>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>

            <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">{{ errorMessage }}</div>
            
            <div class="login-link">
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.signup-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.signup-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.quote-container {
  position: relative;
  z-index: 1;
}

.animated-text {
  animation: fadeInUp 1s ease-out;
}

.quote-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.quote-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.quote-author {
  font-style: italic;
  font-size: 1.1rem;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
}

.signup-right {
  flex: 1;
  padding: 3rem;
}

.signup-form-container {
  max-width: 500px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #718096;
  font-size: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.form-control, .form-select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #764ba2;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .signup-container {
    flex-direction: column;
  }
  
  .signup-left {
    padding: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>