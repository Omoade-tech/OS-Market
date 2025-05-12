<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h5 class="mb-0">Seller Dashboard</h5>
      <button class="mobile-toggle" @click="toggleMobileMenu">
        <i class="fas fa-bars"></i>
      </button>
    </div>
    <div class="sidebar-menu" :class="{ 'mobile-open': isMobileMenuOpen }">
    
      <router-link to="/seller/add-listing" class="sidebar-item" active-class="active" @click="closeMobileMenu">
        <i class="fas fa-plus-circle me-2"></i>
        Add Listing
      </router-link>
      <router-link to="/seller/listings" class="sidebar-item" active-class="active" @click="closeMobileMenu">
        <i class="fas fa-list me-2"></i>
        View Listings
      </router-link>
      <router-link to="/seller/messages" class="sidebar-item" active-class="active" @click="closeMobileMenu">
        <i class="fas fa-envelope me-2"></i>
        Messages
      </router-link>
      <router-link to="/seller/profile" class="sidebar-item" active-class="active" @click="closeMobileMenu">
        <i class="fas fa-user me-2"></i>
        Profile
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SellerSidebar',
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #1a1a2e;
  height: 100vh;
  width: 210px;
  position: fixed;
  left: 0;
  top: 10;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 900;
  /* color: #fff; */
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #16213e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h5 {
  color: #fff;
  font-weight: 600;
  margin: 0;
  font-size: 1.2rem;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

.sidebar-menu {
  padding: 20px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  color: #e2e2e2;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 4px 0;
  border-radius: 0 20px 20px 0;
  margin-right: 10px;
}

.sidebar-item:hover {
  background-color: #16213e;
  color: #4cc9f0;
  transform: translateX(5px);
}

.sidebar-item.active {
  background-color: #16213e;
  color: #4cc9f0;
  border-left: 4px solid #4cc9f0;
  font-weight: 500;
}

.sidebar-item i {
  width: 24px;
  text-align: center;
  font-size: 1.1rem;
  margin-right: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    top: 60px;
    left: 0;
    z-index: 900;
  }

  .mobile-toggle {
    display: block;
  }

  .sidebar-menu {
    display: none;
    padding: 10px;
    background-color: #1a1a2e;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .sidebar-menu.mobile-open {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .sidebar-item {
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0;
    border-radius: 0;
  }

  .sidebar-item:last-child {
    border-bottom: none;
  }
}
</style> 