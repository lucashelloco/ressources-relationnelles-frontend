import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(authService.getUser())
  const token = ref(authService.getToken())
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isSuperAdmin = computed(() => user.value?.role?.slug === 'super-admin')
  const isAdmin = computed(() =>
    user.value?.role?.slug === 'admin' || user.value?.role?.slug === 'super-admin'
  )
  const isModerator = computed(() => isAdmin.value)

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login(credentials)
      user.value = data.user
      token.value = data.token
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.register(userData)
      user.value = data.user
      token.value = data.token
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
    } finally {
      user.value = null
      token.value = null
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    loading.value = true
    try {
      const data = await authService.getCurrentUser()
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err)
      // Si le token est invalide, déconnecter l'utilisateur
      await logout()
    } finally {
      loading.value = false
    }
  }

  function hasPermission(permission) {
    if (!user.value?.role?.permissions) return false
    return user.value.role.permissions.includes(permission)
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isModerator,
    login,
    register,
    logout,
    fetchUser,
    hasPermission
  }
})
