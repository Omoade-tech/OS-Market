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
  background-color: #f0f8ff;
}

.main-content {
  flex: 1;
  margin-left: 200px; 
  padding: 20px;
    

  min-height: calc(100vh - 60px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style> 