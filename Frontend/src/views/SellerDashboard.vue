<template>
  <div class="seller-dashboard" v-if="isAuthenticated">
    <SellerSidebar />
    <div class="main-content">
      <router-view v-if="$route.name" />
      <ViewSellerListing v-else />
    </div>
  </div>
  <div v-else>
    <p>Please login to access the seller dashboard</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import SellerSidebar from '@/components/SellerSidebar.vue';
import ViewSellerListing from '@/views/seller/ViewSellerListing.vue';

export default {
  name: 'SellerDashboard',
  components: {
    SellerSidebar,
    ViewSellerListing
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
  margin-left: 250px;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-top: 60px; 
    padding: 15px;
  }
}
</style>