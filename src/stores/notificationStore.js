import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import notificationService from '@/services/notificationService'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)

  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchNotifications() {
    try {
      loading.value = true
      const response = await notificationService.getNotifications()
      notifications.value = response.data.data
      unreadCount.value = response.data.unread_count
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await notificationService.getUnreadCount()
      unreadCount.value = response.data.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  async function markAsRead(notificationId) {
    try {
      await notificationService.markAsRead(notificationId)

      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.est_lue) {
        notification.est_lue = true
        notification.date_lecture = new Date()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async function markAllAsRead() {
    try {
      await notificationService.markAllAsRead()

      // Update local state
      notifications.value.forEach(n => {
        if (!n.est_lue) {
          n.est_lue = true
          n.date_lecture = new Date()
        }
      })
      unreadCount.value = 0
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  async function deleteNotification(notificationId) {
    try {
      await notificationService.deleteNotification(notificationId)

      // Remove from local state
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        const wasUnread = !notifications.value[index].est_lue
        notifications.value.splice(index, 1)
        if (wasUnread) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  function addNotification(notification) {
    // Add to beginning of array
    notifications.value.unshift(notification)

    // Increment unread count if not already read
    if (!notification.est_lue) {
      unreadCount.value++
    }
  }

  function reset() {
    notifications.value = []
    unreadCount.value = 0
  }

  return {
    notifications,
    unreadCount,
    hasUnread,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    reset
  }
})
