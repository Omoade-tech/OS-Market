<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light-transparent">
      <div class="container">
        <router-link class="navbar-brand " to="/">OS-Market</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <template v-if="!isAuthenticated">
            <li class="nav-item me-3">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item me-3">
              <router-link class="nav-link" to="/about">About</router-link>
            </li>
            
            </template>
          
            <!-- <template v-if="isAuthenticated">
              <li v-if="user?.role === 'buyer'" class="nav-item me-3">
                <router-link class="nav-link" to="/listing">Listing</router-link>
              </li>
            </template> -->
          </ul>
        </div>
        <div class="navbar-nav ms-auto">
          <template v-if="!isAuthenticated">
            <li class="nav-item order-last">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item order-last">
              <router-link class="nav-link" to="/signup">Register</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Welcome
                {{ user?.name || 'Account' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li v-if="user?.role === 'seller'">
                  <router-link class="dropdown-item" :to="'/seller/dashboard'">Dashboard</router-link>
                </li>
                <li v-if="user?.role === 'seller'">
                  <router-link class="dropdown-item" to="/profile">Profile</router-link>
                </li>
                <li v-if="user?.role === 'buyer'">
                  <router-link class="dropdown-item" to="/buyerdashboard">Dashboard</router-link>
                </li>
                <!-- <li v-if="user?.role === 'buyer'">
                  <router-link class="dropdown-item" to="/listing">Listing</router-link>
                </li> -->
                <li v-if="user?.role === 'buyer'">
                  <router-link class="dropdown-item" to="/profile">Profile</router-link>
                </li>
                <li v-if="user?.role === 'admin'">
                  <router-link class="dropdown-item" to="/admindashboard">Dashboard</router-link>
                </li>
                <li v-if="user?.role === 'admin'">
                  <router-link class="dropdown-item" to="/profile">Profile</router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a>
                </li>
              </ul>
            </li>
            
          </template>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  
  export default {
    
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const isAuthenticated = computed(() => authStore.isAuthenticated);
      const user = computed(() => authStore.user);
  
      const handleLogout = async () => {
        try {
          await authStore.logout();
          router.push('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };
  
      return {
        isAuthenticated,
        user,
        handleLogout
      };
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
  }
  
  .dropdown-menu {
    min-width: 200px;
    z-index: 1100; /* Higher than sidebar */
  }
  
  .dropdown-item:active {
    background-color: #007bff;
  }
  /* .navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: #f8f9fa; 
  z-index: 1000; 
} */

  </style>