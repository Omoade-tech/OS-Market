<template>
  <div class="seller-dashboard" v-if="isAuthenticated">
    <div class="main-content">
      <div class="dashboard-grid">
        <div class="listings-section">
          <ViewSellerListing />
        </div>
        <div class="profile-section">
          <!-- <Profile /> -->
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Please login to access the seller dashboard</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ViewSellerListing from '@/views/seller/ViewSellerListing.vue';
import Profile from '@/views/Profile.vue';

export default {
  name: 'SellerDashboard',
  components: {
    ViewSellerListing,
    Profile
  },
  setup() {
    const authStore = useAuthStore();
    return {
      isAuthenticated: computed(() => authStore.isAuthenticated)
    };
  }
}
</script>

<style scoped>
.seller-dashboard {
  display: flex;
  min-height: 100vh;
  padding-top: 60px;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.listings-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.profile-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: fit-content;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 15px;
  }
}
</style>