<template>
  <div class="messages-container">
    <div v-if="!authStore.getIsSeller" class="text-center py-8">
      <p class="text-red-500">Access denied. This page is for sellers only.</p>
      <button @click="$router.push('/login')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Login
      </button>
    </div>

    <template v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Messages from Buyers</h2>
        <div class="flex items-center space-x-4">
          <span v-if="authStore.getUnreadCount > 0" class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            {{ authStore.getUnreadCount }} unread messages
          </span>
          <button @click="refreshMessages" class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
            <i class="fas fa-sync-alt mr-1"></i> Refresh
          </button>
        </div>
      </div>
      
      <div v-if="authStore.loading" class="flex justify-center">
        <div class="loader">Loading messages...</div>
      </div>

      <div v-else-if="authStore.error" class="text-center py-8">
        <p class="text-red-500">{{ authStore.error }}</p>
      </div>

      <div v-else-if="!messages.length" class="text-center py-8">
        <p class="text-gray-500">No messages yet</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Messages List -->
        <div v-if="!selectedConversation" class="space-y-4">
          <div v-for="message in messages" :key="message.id" 
               class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-semibold text-lg">{{ message.sender_name }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(message.last_message_at) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span v-if="message.unread_count > 0" 
                      class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {{ message.unread_count }} new
                </span>
                <span :class="['px-2 py-1 rounded text-sm', 
                             message.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600']">
                  {{ message.read ? 'Read' : 'New' }}
                </span>
              </div>
            </div>
            <p class="text-gray-700">{{ message.last_message }}</p>
            <div class="mt-3 flex justify-end space-x-2">
              <button @click="viewConversation(message.id)" 
                      class="px-3 py-1 text-sm bg-blue-500 text-dark rounded hover:bg-blue-600">
                reply buyer
              </button>
            </div>
          </div>
        </div>

        <!-- Conversation View -->
        <div v-else class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg">Conversation with {{ selectedConversation.sender_name }}</h3>
              <button @click="selectedConversation = null" 
                      class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div v-if="loadingConversation" class="p-8 text-center">
            <div class="loader mx-auto"></div>
            <p class="mt-2 text-gray-500">Loading conversation...</p>
          </div>

          <div v-else class="conversation-container">
            <div ref="messagesContainer" class="p-4 space-y-4 max-h-[400px] overflow-y-auto">
              <div v-for="msg in selectedConversation.messages" :key="msg.id"
                   :class="['flex', msg.sender_id === authStore.userId ? 'justify-end' : 'justify-start']">
                <div :class="['max-w-[70%] rounded-lg p-3 relative',
                            msg.sender_id === authStore.userId ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800']">
                  <p class="text-sm">{{ msg.message }}</p>
                  <div class="flex items-center justify-end gap-2 mt-1">
                    <p class="text-xs" :class="msg.sender_id === authStore.userId ? 'text-blue-100' : 'text-gray-500'">
                      {{ formatDate(msg.created_at) }}
                    </p>
                    <span v-if="msg.sender_id === authStore.userId" 
                          :class="['text-xs', msg.read ? 'text-blue-100' : 'text-yellow-200']">
                      {{ msg.read ? '✓ Read' : '✓ Sent' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Form -->
            <div class="p-4 border-t">
              <MessageReplyForm
                :conversation-id="selectedConversation.id"
                :receiver-id="selectedConversation.sender_id"
                @reply-sent="handleReplySent"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import MessageReplyForm from '@/components/MessageReplyForm.vue';

export default {
  name: 'SellerMessages',
  components: {
    MessageReplyForm
  },
  setup() {
    const authStore = useAuthStore();
    const { conversations, getIsSeller, getUnreadCount } = storeToRefs(authStore);

    return {
      authStore,
      conversations,
      getIsSeller,
      getUnreadCount
    };
  },
  data() {
    return {
      messages: [],
      selectedConversation: null,
      loadingConversation: false,
      refreshInterval: null
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    async viewConversation(userId) {
      try {
        this.loadingConversation = true;
        const response = await this.authStore.fetchConversation(userId);
        if (response.success) {
          this.selectedConversation = response.conversation;
          // Ensure we have the sender_id for replies
          if (!this.selectedConversation.sender_id) {
            this.selectedConversation.sender_id = userId;
          }
          // Scroll to bottom after messages load
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        this.loadingConversation = false;
      }
    },
    async handleReplySent() {
      // Refresh the conversation after sending a reply
      if (this.selectedConversation) {
        await this.viewConversation(this.selectedConversation.sender_id);
      }
      // Refresh the messages list
      await this.fetchMessages();
    },
    async refreshMessages() {
      try {
        await this.fetchMessages();
      } catch (error) {
        console.error('Error refreshing messages:', error);
      }
    },
    checkAuth() {
      if (!this.authStore.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      
      if (!this.authStore.getIsSeller) {
        this.authStore.error = 'Access denied. This page is for sellers only.';
      }
    },
    async fetchMessages() {
      try {
        const response = await this.authStore.fetchConversations();
        if (response.success) {
          this.messages = response.messages;
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },
  watch: {
    'selectedConversation.messages': {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  },
  mounted() {
    this.checkAuth();
    this.fetchMessages();
    // Set up auto-refresh every 30 seconds
    this.refreshInterval = setInterval(this.refreshMessages, 30000);
  },
  beforeUnmount() {
    // Clear the refresh interval when component is unmounted
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
</script>

<style scoped>
.messages-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.conversation-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 768px) {
  .messages-container {
    max-height: 300px;
  }
}
</style>
