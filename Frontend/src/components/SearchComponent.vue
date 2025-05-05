<template>
  <div class="card mb-5">
    <div class="card-body">
      <!-- Error Message -->
      <div v-if="searchError" class="alert alert-danger mb-3">
        {{ searchError }}
      </div>

      <div class="d-flex align-items-center gap-2">
        <!-- Search by Name -->
        <div class="flex-grow-1">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search by name..." 
              v-model="searchFilters.name"
              @input="handleSearch"
            >
          </div>
        </div>

        <!-- Search by Location -->
        <div class="flex-grow-1">
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-map-marker-alt"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search by location..." 
              v-model="searchFilters.location"
              @input="handleSearch"
            >
          </div>
        </div>

        <!-- Filter by Condition -->
        <div class="w-25">
          <select 
            class="form-select" 
            v-model="searchFilters.condition"
            @change="handleSearch"
          >
            <option value="">All Conditions</option>
            <option v-for="condition in conditions" :key="condition" :value="condition">
              {{ condition }}
            </option>
          </select>
        </div>

        <!-- Filter by Category -->
        <div class="w-25">
          <select 
            class="form-select" 
            v-model="searchFilters.categories"
            @change="handleSearch"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        

        <!-- Clear Filters Button -->
        <div>
          <button 
            class="btn btn-outline-secondary" 
            @click="clearFilters"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { debounce } from 'lodash';

export default {
  name: 'SearchComponent',
  
  data() {
    return {
      authStore: useAuthStore(),
      searchFilters: {
        name: '',
        location: '',
        categories: '',
        condition: '',
        page: 1,
        per_page: 10
      },
      searchError: null
    };
  },

  computed: {
    categories() {
      return this.authStore.getCategories;
    },
    conditions() {
      return this.authStore.getConditions;
    }
  },

  methods: {
    handleSearch: debounce(async function() {
      try {
        this.searchError = null;
        // Update the store's search filters
        this.authStore.updateSearchFilters(this.searchFilters);
        // Perform the search
        const response = await this.authStore.searchListings(this.searchFilters);
        
        // Emit the search results to the parent component
        this.$emit('search-results', {
          listings: response.data,
          pagination: response.pagination,
          filters: response.filters
        });
      } catch (error) {
        console.error('Search failed:', error);
        this.searchError = error.response?.data?.message || error.message || 'Search failed';
        this.$emit('search-error', this.searchError);
      }
    }, 500),

    async clearFilters() {
      this.searchError = null;
      this.searchFilters = {
        name: '',
        location: '',
        categories: '',
        condition: '',
        page: 1,
        per_page: 10
      };
      this.authStore.clearSearchFilters();
      await this.authStore.fetchListings();
      this.$emit('clear-filters');
    }
  },

  async mounted() {
    await this.authStore.fetchFilterOptions();
  }
};
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.25rem rgba(52, 152, 219, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  border-left: 1px solid #ced4da;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .d-flex {
    flex-wrap: wrap;
  }
  
  .flex-grow-1,
  .w-25 {
    width: 100% !important;
    margin-bottom: 0.5rem;
  }
}
</style> 