<template>
  <div class="message-reply-form">
    <form @submit.prevent="sendReply">
      <div class="form-group">
        <label for="reply">Reply Message</label>
        <div class="relative">
          <textarea 
            id="reply" 
            v-model="reply.content" 
            required 
            placeholder="Type your reply here..."
            rows="4"
            class="form-control"
            @keydown.enter.prevent="handleEnterKey"
            :maxlength="maxLength"
          ></textarea>
          <div class="character-count" :class="{ 'text-red-500': isNearLimit }">
            {{ reply.content.length }}/{{ maxLength }}
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading || !reply.content.trim()">
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Sending...
          </span>
          <span v-else>
            <i class="fas fa-paper-plane"></i> Send Reply
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
  name: 'MessageReplyForm',
  
  props: {
    conversationId: {
      type: [Number, String],
      required: true
    },
    receiverId: {
      type: [Number, String],
      required: true,
      validator: (value) => {
        return value !== null && value !== undefined && value !== '';
      }
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
      reply: {
        content: ''
      },
      loading: false,
      maxLength: 1000
    };
  },

  computed: {
    isNearLimit() {
      return this.reply.content.length > this.maxLength * 0.9;
    }
  },

  methods: {
    handleEnterKey(event) {
      if (event.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      }
      if (this.reply.content.trim() && !this.loading) {
        this.sendReply();
      }
    },
    async sendReply() {
      if (!this.reply.content.trim()) {
        this.toast.error('Please enter a reply message');
        return;
      }

      if (!this.receiverId) {
        this.toast.error('Invalid receiver ID');
        return;
      }

      this.loading = true;

      try {
        const messageData = {
          receiver_id: this.receiverId,
          conversation_id: this.conversationId,
          message: this.reply.content.trim()
        };

        // Add listing information if available
        if (this.listing) {
          messageData.listing_id = this.listing.id;
          messageData.listing_name = this.listing.name;
          messageData.listing_image = this.listing.image;
          messageData.listing_price = this.listing.price;
        }

        const response = await this.authStore.sendMessage(messageData);

        if (response.success) {
          this.reply.content = '';
          this.toast.success('Reply sent successfully!');
          this.$emit('reply-sent');
        } else {
          throw new Error(response.message || 'Failed to send reply');
        }
      } catch (error) {
        console.error('Error sending reply:', error);
        this.toast.error(error.response?.data?.message || error.message || 'Failed to send reply');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.message-reply-form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.form-actions {
  margin-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .message-reply-form {
    padding: 1rem;
  }
}

.relative {
  position: relative;
}

.character-count {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.form-control {
  padding-bottom: 2rem;
}

/* Add a subtle animation for the send button */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.btn-primary:active::after {
  width: 200%;
  height: 200%;
}

/* Improve textarea focus state */
.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
  transition: all 0.3s ease;
}

/* Add a subtle hover effect to the form */
.message-reply-form:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}
</style> 