<template>
  <div class="search-container mt-5 mb-4 bg-dark ">
    <!-- Error Message -->
    <div v-if="searchError" class="alert alert-danger mb-2">
      {{ searchError }}
    </div>

    <div class="search-bar">
      <!-- Search by Name -->
      <div class="search-input">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          placeholder="Search by name..." 
          v-model="searchFilters.name"
          @input="handleSearch"
        >
      </div>

      <!-- Search by Location -->
      <div class="search-input">
        <i class="fas fa-map-marker-alt search-icon"></i>
        <input 
          type="text" 
          placeholder="Search by location..." 
          v-model="searchFilters.location"
          @input="handleSearch"
        >
      </div>

      <!-- Filter by Condition -->
      <div class="search-select">
        <select 
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
      <div class="search-select">
        <select 
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
      <button 
        class="clear-btn" 
        @click="clearFilters"
        title="Clear filters"
      >
        <i class="fas fa-times"></i>
      </button>
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
.search-container {
  background: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.search-input {
  position: relative;
  flex: 1;
  min-width: 150px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.9rem;
}

.search-input input {
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  outline: none;
}

.search-select {
  min-width: 100px;
  max-width: 120px;
}

.search-select select {
  width: 100%;
  padding: 0.5rem 1.5rem 0.5rem 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  background-color: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-select select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  outline: none;
}

.clear-btn {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
}

.clear-btn:hover {
  background: #f8f9fa;
  color: #dc3545;
  border-color: #dc3545;
}

.alert {
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .search-bar {
    flex-wrap: wrap;
  }
  
  .search-input {
    width: calc(50% - 0.5rem);
    min-width: 120px;
  }
  
  .search-select {
    width: calc(25% - 0.5rem);
    min-width: 100px;
    max-width: none;
  }
  
  .clear-btn {
    width: 36px;
  }
}

@media (max-width: 768px) {
  .search-input,
  .search-select {
    width: 100%;
    max-width: none;
  }
}
</style> 