<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
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
</style>
