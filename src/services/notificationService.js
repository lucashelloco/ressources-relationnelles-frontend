import api from './api'

export default {
  // Get all notifications
  getNotifications() {
    return api.get('/notifications')
  },

  // Get unread count
  getUnreadCount() {
    return api.get('/notifications/unread-count')
  },

  // Mark as read
  markAsRead(notificationId) {
    return api.post(`/notifications/${notificationId}/mark-as-read`)
  },

  // Mark all as read
  markAllAsRead() {
    return api.post('/notifications/mark-all-as-read')
  },

  // Delete notification
  deleteNotification(notificationId) {
    return api.delete(`/notifications/${notificationId}`)
  }
}
