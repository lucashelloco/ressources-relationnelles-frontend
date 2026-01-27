import api from './api'

export default {
  // Get all discussions for a resource
  getDiscussions(ressourceId) {
    return api.get(`/ressources/${ressourceId}/discussions`)
  },

  // Create a new discussion
  createDiscussion(ressourceId, data) {
    return api.post(`/ressources/${ressourceId}/discussions`, data)
  },

  // Get messages for a discussion
  getMessages(ressourceId, discussionId) {
    return api.get(`/ressources/${ressourceId}/discussions/${discussionId}`)
  },

  // Send a message to a discussion
  sendMessage(ressourceId, discussionId, contenu) {
    return api.post(`/ressources/${ressourceId}/discussions/${discussionId}/messages`, { contenu })
  },

  // Delete a discussion
  deleteDiscussion(ressourceId, discussionId) {
    return api.delete(`/ressources/${ressourceId}/discussions/${discussionId}`)
  }
}
