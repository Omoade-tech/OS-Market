<template>
  <div class="container my-5 dashboard-container">
    <div class="row">
      <div class="col-12">
        <h1 class="mt-5 text-primary dashboard-title">Admin Dashboard</h1>
        
        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
          <div class="spinner-border text-primary loading-spinner" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger mb-4 error-message">
          {{ error }}
        </div>

        <!-- Welcome Card -->
        <div class="card welcome-card mb-4">
          <div class="card-body">
            <h2 class="card-title">Welcome, {{ user?.name || 'Admin' }}! 👋</h2>
            <p class="card-text">This is your admin dashboard where you can:</p>
            <ul class="feature-list">
              <li class="feature-item">
                <i class="bi bi-list-check"></i>
                Manage listings and their status
              </li>
              <li class="feature-item">
                <i class="bi bi-graph-up"></i>
                Monitor marketplace activity
              </li>
              <li class="feature-item">
                <i class="bi bi-bar-chart"></i>
                View listing statistics
              </li>
              <li class="feature-item">
                <i class="bi bi-flag"></i>
                Handle user reports
              </li>
            </ul>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div v-if="!loading" class="row g-4 mb-4 stats-container">
          <div class="col-md-3">
            <div class="card stat-card bg-primary text-white h-100">
              <div class="card-body">
                <div class="stat-icon">
                  <i class="bi bi-grid-3x3-gap"></i>
                </div>
                <h5 class="card-title">Total Listings</h5>
                <h2 class="display-4 stat-number">{{ stats.total }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card bg-warning text-dark h-100">
              <div class="card-body">
                <div class="stat-icon">
                  <i class="bi bi-clock-history"></i>
                </div>
                <h5 class="card-title">Pending Listings</h5>
                <h2 class="display-4 stat-number">{{ stats.pending }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card bg-success text-white h-100">
              <div class="card-body">
                <div class="stat-icon">
                  <i class="bi bi-check-circle"></i>
                </div>
                <h5 class="card-title">Approved Listings</h5>
                <h2 class="display-4 stat-number">{{ stats.approved }}</h2>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card stat-card bg-danger text-white h-100">
              <div class="card-body">
                <div class="stat-icon">
                  <i class="bi bi-x-circle"></i>
                </div>
                <h5 class="card-title">Rejected Listings</h5>
                <h2 class="display-4 stat-number">{{ stats.rejected }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Listings Link -->
        <div class="card action-card">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-gear"></i>
              Manage Listings
            </h5>
            <p class="card-text">View and manage all marketplace listings, including pending approvals and status updates.</p>
            <router-link to="/adminlistings" class="btn btn-primary action-button">
              <i class="bi bi-arrow-right"></i>
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
.dashboard-container {
  animation: fadeIn 0.5s ease-in;
}

.dashboard-title {
  font-weight: 600;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.dashboard-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--bs-primary);
  border-radius: 2px;
}

.card {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: none;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.welcome-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.feature-list {
  list-style-type: none;
  padding-left: 0;
  margin-top: 1.5rem;
}

.feature-item {
  padding: 0.75rem 0;
  color: #444;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.feature-item:hover {
  transform: translateX(10px);
}

.feature-item i {
  margin-right: 1rem;
  font-size: 1.2rem;
  color: var(--bs-primary);
}

.stat-card {
  overflow: hidden;
  position: relative;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.stat-number {
  font-weight: 600;
  margin: 0;
  animation: countUp 1s ease-out;
}

.action-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.action-button:hover i {
  transform: translateX(3px);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.error-message {
  animation: shake 0.5s ease-in-out;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .welcome-card,
  .action-card {
    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  }

  .card-title,
  .card-text,
  .feature-item {
    color: #e0e0e0;
  }

  /* Preserve original stat card colors in dark mode */
  .stat-card.bg-primary {
    background-color: var(--bs-primary) !important;
  }

  .stat-card.bg-warning {
    background-color: var(--bs-warning) !important;
  }

  .stat-card.bg-success {
    background-color: var(--bs-success) !important;
  }

  .stat-card.bg-danger {
    background-color: var(--bs-danger) !important;
  }

  .stat-card.text-dark {
    color: var(--bs-dark) !important;
  }
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .dashboard-title {
    font-size: 1.75rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .feature-item {
    padding: 0.5rem 0;
  }
}

@media screen and (max-width: 576px) {
  .dashboard-title {
    font-size: 1.5rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>