<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">Admin Dashboard</h1>
        
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger mb-4">
          {{ error }}
        </div>

        <!-- Welcome Card -->
        <div class="card mb-4">
          <div class="card-body">
            <h2 class="card-title">Welcome, {{ user?.name || 'Admin' }}!</h2>
            <p class="card-text">This is your admin dashboard where you can:</p>
            <ul>
              <li>Manage listings and their status</li>
              <li>Monitor marketplace activity</li>
              <li>View listing statistics</li>
              <li>Handle user reports</li>
            </ul>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div v-if="!loading" class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white h-100">
              <div class="card-body">
                <h5 class="card-title">Total Listings</h5>
                <h2 class="display-4">{{ stats.total }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-dark h-100">
              <div class="card-body">
                <h5 class="card-title">Pending Listings</h5>
                <h2 class="display-4">{{ stats.pending }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white h-100">
              <div class="card-body">
                <h5 class="card-title">Approved Listings</h5>
                <h2 class="display-4">{{ stats.approved }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-danger text-white h-100">
              <div class="card-body">
                <h5 class="card-title">Rejected Listings</h5>
                <h2 class="display-4">{{ stats.rejected }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Listings Link -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Manage Listings</h5>
            <p class="card-text">View and manage all marketplace listings, including pending approvals and status updates.</p>
            <router-link to="/adminlistings" class="btn btn-primary">
              Go to Listings Management
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.getUser);
    const loading = computed(() => authStore.getLoading);
    const error = computed(() => authStore.getError);
    const isAdmin = computed(() => authStore.getIsAdmin);
    const router = useRouter();
    const stats = ref({
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    });

    const fetchStats = async () => {
      try {
        const response = await authStore.getAdminStats();
        if (response.success && response.data) {
          stats.value = {
            total: response.data.total || 0,
            pending: response.data.pending || 0,
            approved: response.data.approved || 0,
            rejected: response.data.rejected || 0
          };
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    onMounted(async () => {
      try {
        // First check if user is authenticated
        if (!authStore.getIsAuthenticated) {
          router.push({ name: 'login' });
          return;
        }

        // Then check if user is admin
        if (!authStore.getIsAdmin) {
          router.push({ name: 'home' });
          return;
        }

        // If both checks pass, fetch the stats
        await fetchStats();
      } catch (err) {
        console.error('Error in AdminDashboard setup:', err);
        if (err.response?.status === 401) {
          router.push({ name: 'login' });
        } else if (err.response?.status === 403) {
          router.push({ name: 'home' });
        }
      }
    });

    return {
      user,
      loading,
      error,
      stats,
      isAdmin
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