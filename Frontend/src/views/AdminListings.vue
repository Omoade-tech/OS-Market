<template>
  <div class="container py-4 mt-5">
    <h2 class="h3 mb-4">Manage Listings</h2>
    
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

    <!-- Listings Table -->
    <div v-if="!loading" class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Seller</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="listing in listings" :key="listing.id">
            <td>
              <img 
                :src="listing.image_url || '/placeholder-image.jpg'" 
                :alt="listing.name"
                class="img-thumbnail"
                style="width: 80px; height: 80px; object-fit: cover;"
              >
            </td>
            <td>{{ listing.name }}</td>
            <td style="max-width: 300px;">
              <p class="mb-0 text-wrap">{{ listing.description }}</p>
            </td>
            <td>${{ listing.price }}</td>
            <td>{{ listing.categories }}</td>
            <td>
              <span 
                :class="{
                  'badge': true,
                  'bg-warning': listing.status === 'pending',
                  'bg-success': listing.status === 'approved',
                  'bg-danger': listing.status === 'rejected'
                }"
              >
                {{ listing.status }}
              </span>
            </td>
            <td>
              <span v-if="listing.user">
                {{ listing.user.name }}
                <small class="text-muted d-block">{{ listing.user.email }}</small>
              </span>
              <span v-else class="text-muted">Unknown</span>
            </td>
            <td>
              <div class="btn-group">
                <button
                  v-if="listing.status !== 'approved'"
                  @click="updateStatus(listing.id, 'approved')"
                  :disabled="statusUpdateLoading"
                  class="btn btn-success btn-sm"
                >
                  <i class="bi bi-check-lg me-1"></i>Approve
                </button>
                <button
                  v-if="listing.status !== 'rejected'"
                  @click="updateStatus(listing.id, 'rejected')"
                  :disabled="statusUpdateLoading"
                  class="btn btn-danger btn-sm ms-2"
                >
                  <i class="bi bi-x-lg me-1"></i>Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav v-if="pagination.last_page > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">Previous</a>
          </li>
          <li v-for="page in pagination.last_page" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
            <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- No Listings Message -->
    <div v-if="!loading && listings.length === 0" class="text-center py-5">
      <p class="text-muted">No listings found</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from 'vue-toastification';

export default {
  name: 'AdminListings',
  
  data() {
    return {
      authStore: useAuthStore(),
      toast: useToast(),
      loading: false,
      error: null,
      statusUpdateLoading: false,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      }
    };
  },

  computed: {
    listings() {
      return this.authStore.getListings;
    }
  },

  methods: {
    async fetchListings(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.authStore.getAllListings(page);
        if (response.pagination) {
          this.pagination = response.pagination;
        }
      } catch (error) {
        this.error = 'Failed to fetch listings';
        this.toast.error('Failed to fetch listings');
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(listingId, status) {
      this.statusUpdateLoading = true;
      try {
        await this.authStore.updateListingStatus(listingId, status);
        this.toast.success(`Listing ${status} successfully`);
        // Refresh the current page
        await this.fetchListings(this.pagination.current_page);
      } catch (error) {
        this.toast.error(error.message || 'Failed to update listing status');
      } finally {
        this.statusUpdateLoading = false;
      }
    },

    async changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        await this.fetchListings(page);
      }
    }
  },

  mounted() {
    this.fetchListings();
  }
};
</script>

<style scoped>
.table th {
  white-space: nowrap;
}

.btn-group {
  white-space: nowrap;
}

/* Add text wrapping for description */
.text-wrap {
  white-space: normal;
  word-wrap: break-word;
}

/* Pagination styles */
.pagination {
  margin-bottom: 0;
}

.page-link {
  cursor: pointer;
}

/* Responsive table styles */
@media screen and (max-width: 1200px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .table td, .table th {
    min-width: 120px;
  }
  
  .table td:nth-child(3) { 
    min-width: 200px;
  }
  
  .table td:nth-child(1) {
    min-width: 100px;
  }

  /* Scrollbar styles for medium screens */
  .table-responsive::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}

@media screen and (max-width: 768px) {
  .table td, .table th {
    min-width: 100px;
  }
  
  .table td:nth-child(3) { 
    min-width: 150px;
  }
  
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-group .btn {
    margin: 0 !important;
  }

  /* Scrollbar styles for tablets */
  .table-responsive::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .table-responsive::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .table-responsive::-webkit-scrollbar-thumb {
    background: #888;
  }
}

@media screen and (max-width: 576px) {
  .table td, .table th {
    min-width: 80px;
  }
  
  .table td:nth-child(3) { 
    min-width: 120px;
  }
  
  .img-thumbnail {
    width: 60px !important;
    height: 60px !important;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
  
  .page-item {
    margin: 2px;
  }

  /* Scrollbar styles for mobile */
  .table-responsive {
    max-height: 60vh;
  }

  .table-responsive::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  .table-responsive::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .table-responsive::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Dark mode support for mobile */
  @media (prefers-color-scheme: dark) {
    .table-responsive::-webkit-scrollbar-track {
      background: #2d2d2d;
    }
    
    .table-responsive::-webkit-scrollbar-thumb {
      background: #666;
    }
  }
}
</style> 