<template>
  <div class="seller-layout">
    <SellerSidebar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import SellerSidebar from '@/components/SellerSidebar.vue';

export default {
  name: 'SellerLayout',
  components: {
    SellerSidebar
  }
}
</script>

<style scoped>
.seller-layout {
  display: flex;
  min-height: 100vh;
  margin-top: 60px; 
}

.main-content {
  flex: 1;
  margin-left: 250px; 
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 60px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style> 