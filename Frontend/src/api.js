// Message API endpoints
export const messageApi = {
  // Get all conversations for the current user
  getConversations() {
    return axios.get('/api/messages/dashboard');
  },

  // Get conversation with a specific user
  getConversation(userId) {
    return axios.get(`/api/messages/conversation/${userId}`);
  },

  // Send a message to a user
  sendMessage(data) {
    return axios.post('/api/messages/send', data);
  }
}; 