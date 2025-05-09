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
          <!-- <button @click="refreshMessages" class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
            <i class="fas fa-sync-alt mr-1"></i> Refresh
          </button> -->
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
               class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="p-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-lg text-gray-800">{{ message.sender_name }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(message.last_message_at) }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span v-if="message.unread_count > 0" 
                        class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                    {{ message.unread_count }} new
                  </span>
                  <span :class="['px-2 py-1 rounded text-xs font-medium', 
                               message.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600']">
                    {{ message.read ? 'Read' : 'New' }}
                  </span>
                </div>
              </div>
              
              <div v-if="message.listing" class="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div class="relative w-[40px] h-[40px] flex-shrink-0 overflow-hidden">
                  <img :src="getImageUrl(message.listing.image)" 
                       :alt="message.listing.name"
                       class="w-full h-full object-cover rounded">
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-800 truncate">{{ message.listing.name }}</h4>
                  <p class="text-xs text-gray-500">ID: {{ message.listing.id }}</p>
                  <p class="text-sm font-semibold text-green-600">${{ formatPrice(message.listing.price) }}</p>
                </div>
              </div>
              
              <p class="text-gray-700 text-sm mb-3 line-clamp-2">{{ message.last_message }}</p>
              
              <div class="flex justify-end">
                <button @click="viewConversation(message.id)" 
                        class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2">
                  <i class="fas fa-reply text-dark"></i>
                  <span class="text-dark">Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversation View -->
        <div v-else class="bg-white rounded-lg shadow-sm">
          <div class="p-4 border-b border-gray-100">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg text-gray-800">Conversation with {{ selectedConversation.sender_name }}</h3>
              <button @click="selectedConversation = null" 
                      class="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div v-if="loadingConversation" class="p-8 text-center">
            <div class="loader mx-auto"></div>
            <p class="mt-2 text-gray-500">Loading conversation...</p>
          </div>

          <div v-else class="conversation-container">
            <div v-if="selectedConversation.listing" class="p-4 border-b border-gray-100 bg-gray-50">
              <div class="flex items-center space-x-3">
                <div class="relative w-[40px] h-[40px] flex-shrink-0 overflow-hidden">
                  <img :src="getImageUrl(selectedConversation.listing.image)" 
                       :alt="selectedConversation.listing.name"
                       class="w-full h-full object-cover rounded">
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-800 truncate">{{ selectedConversation.listing.name }}</h4>
                  <p class="text-xs text-gray-500">ID: {{ selectedConversation.listing.id }}</p>
                  <p class="text-sm font-semibold text-green-600">₦{{ formatPrice(selectedConversation.listing.price) }}</p>
                </div>
              </div>
            </div>

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
                      {{ msg.read ? ' Read' : ' Sent' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Form -->
            <div class="p-4 border-t border-gray-100">
              <MessageReplyForm
                :conversation-id="selectedConversation.id"
                :receiver-id="selectedConversation.sender_id"
                :listing="selectedConversation.listing"
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
      
      const baseUrl = 'http://localhost:8000';
      return `${baseUrl}${image}`;
    },
    async refreshMessages() {
      try {
        this.loading = true;
        await this.fetchMessages();
        if (this.selectedConversation) {
          await this.viewConversation(this.selectedConversation.sender_id);
        }
      } catch (error) {
        console.error('Error refreshing messages:', error);
      } finally {
        this.loading = false;
      }
    },
    async viewConversation(userId) {
      try {
        console.log('Starting viewConversation with userId:', userId);
        this.loadingConversation = true;
        const response = await this.authStore.fetchConversation(userId);
        console.log('Conversation Response:', response);
        if (response.success) {
          this.selectedConversation = response.conversation;
          console.log('Selected Conversation:', this.selectedConversation);
          console.log('Selected Conversation Listing:', this.selectedConversation?.listing);
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
        console.error('Error in viewConversation:', error);
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
    async fetchMessages() {
      try {
        console.log('Starting fetchMessages');
        const response = await this.authStore.fetchConversations();
        console.log('Fetch Messages Response:', response);
        if (response.success) {
          this.messages = response.messages;
          console.log('Updated Messages:', this.messages);
        }
      } catch (error) {
        console.error('Error in fetchMessages:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
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

/* Message card hover effect */
.message-card {
  transition: transform 0.2s ease-in-out;
}

.message-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .messages-container {
    padding: 10px;
  }
  
  .message-card {
    margin-bottom: 1rem;
  }
}
</style>
