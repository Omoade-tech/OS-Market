<template>
  <div class="message-form">
    <h3>Send Message to Seller</h3>
    
    <!-- Listing Details -->
    <div v-if="listing" class="listing-details mb-4 p-4 bg-gray-50 rounded">
      <div class="flex items-center space-x-3">
        <img :src="getImageUrl(listing.image)" 
             :alt="listing.name"
             class="w-16 h-16 object-cover rounded">
        <div>
          <h4 class="font-medium text-gray-800">{{ listing.name }}</h4>
          <p class="text-sm text-gray-500">Listing ID: {{ listing.id }}</p>
          <p class="text-sm font-semibold text-green-600">₦{{ formatPrice(listing.price) }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage">
      <div class="form-group">
        <label for="message">Message</label>
        <textarea 
          id="message" 
          v-model="message.content" 
          required 
          placeholder="Type your message here..."
          rows="5"
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="send-btn" :disabled="loading">
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Sending...
          </span>
          <span v-else>
            <i class="fas fa-paper-plane"></i> Send Message
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from "vue-toastification";

export default {
  name: 'MessageForm',
  
  props: {
    listingId: {
      type: [Number, String],
      required: true
    },
    sellerId: {
      type: [Number, String],
      required: true
    },
    listing: {
      type: Object,
      default: null
    }
  },

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      authStore: useAuthStore(),
      message: {
        content: ''
      },
      loading: false
    };
  },

  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-NG').format(price);
    },
    getImageUrl(image) {
      if (!image) {
        return 'https://placehold.co/640x480/004477/FFFFFF?text=No+Image';
      }
      
      if (image.startsWith('http')) {
        return image;
      }
      
      if (image.startsWith('storage/')) {
        return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${image}`;
      }
      
      return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${image}`;
    },
    async sendMessage() {
      if (!this.message.content.trim()) {
        this.toast.error('Please enter a message');
        return;
      }

      this.loading = true;

      try {
        const response = await this.authStore.sendMessage({
          receiver_id: this.sellerId,
          listing_id: this.listingId,
          message: this.message.content.trim()
        });

        if (response.success) {
          this.message.content = '';
          this.toast.success('Message sent successfully!');
          this.$emit('message-sent');
        } else {
          throw new Error(response.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        this.toast.error(error.response?.data?.message || error.message || 'Failed to send message');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.message-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.message-form h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.listing-details {
  border: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-actions {
  margin-top: 1.5rem;
}

.send-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.send-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.send-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .message-form {
    padding: 1.5rem;
  }
}
</style> 