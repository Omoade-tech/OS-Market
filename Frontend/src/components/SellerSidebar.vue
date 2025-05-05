<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h5 class="mb-0">Seller Dashboard</h5>
      <button class="mobile-toggle" @click="toggleMobileMenu">
        <i class="fas fa-bars"></i>
      </button>
    </div>
    <div class="sidebar-menu" :class="{ 'mobile-open': isMobileMenuOpen }">
      <router-link to="/seller/opdashboard" class="sidebar-item" active-class="active" @click="closeMobileMenu">
        <i class="fas fa-home me-2"></i>
        Dashboard
      </router-link>
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
  background-color: #fff;
  height: 100vh;
  width: 250px;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 900; /* Lower z-index to stay below navbar */
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h5 {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #2c3e50;
  cursor: pointer;
}

.sidebar-menu {
  padding: 20px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar-item:hover {
  background-color: #f8f9fa;
  color: #3498db;
}

.sidebar-item.active {
  background-color: #e3f2fd;
  color: #3498db;
  border-left: 4px solid #3498db;
}

.sidebar-item i {
  width: 20px;
  text-align: center;
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
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
    border-bottom: 1px solid #eee;
  }

  .sidebar-item:last-child {
    border-bottom: none;
  }
}
</style> 