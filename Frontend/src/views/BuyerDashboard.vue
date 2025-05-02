<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Categories</h5>
            <div class="list-group">
              <a href="#" class="list-group-item list-group-item-action">Electronics</a>
              <a href="#" class="list-group-item list-group-item-action">Clothing</a>
              <a href="#" class="list-group-item list-group-item-action">Home & Garden</a>
              <a href="#" class="list-group-item list-group-item-action">Books</a>
              <a href="#" class="list-group-item list-group-item-action">Sports</a>
            </div>

            <h5 class="card-title mt-4">Condition</h5>
            <div class="list-group">
              <a href="#" class="list-group-item list-group-item-action">New</a>
              <a href="#" class="list-group-item list-group-item-action">Like New</a>
              <a href="#" class="list-group-item list-group-item-action">Good</a>
              <a href="#" class="list-group-item list-group-item-action">Fair</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-md-9">
        <h1 class="mb-4">Buyer Dashboard</h1>
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">Welcome, {{ user?.name || 'Buyer' }}!</h2>
            <p class="card-text">This is your buyer dashboard where you can:</p>
            <ul>
              <li>Browse available products</li>
              <li>View your purchase history</li>
              <li>Manage your account settings</li>
              <li>Contact sellers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    return {
      user
    };
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  color: #333;
  margin-bottom: 1rem;
}

.card-text {
  color: #666;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  padding: 0.5rem 0;
  color: #444;
}

ul li:before {
  content: "✓";
  color: #28a745;
  margin-right: 0.5rem;
}

.list-group-item {
  cursor: pointer;
}
</style>
