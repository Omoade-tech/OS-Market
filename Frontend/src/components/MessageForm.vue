<template>
  <div class="message-form">
    <h3>Send Message to Seller</h3>
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
    async sendMessage() {
      this.loading = true;

      try {
        const response = await this.authStore.sendMessage({
          listing_id: this.listingId,
          seller_id: this.sellerId,
          message: this.message.content
        });

        if (response.success) {
          this.message.content = '';
          this.toast.success('Message sent successfully!', {
            timeout: 3000,
          });
          // Emit success event to parent
          this.$emit('message-sent');
        } else {
          throw new Error(response.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        this.toast.error(error.response?.data?.message || error.message || 'Failed to send message', {
          timeout: 5000,
        });
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