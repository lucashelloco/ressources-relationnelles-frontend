import api from './api'

export const authService = {
  // Inscription
  async register(userData) {
    const response = await api.post('/register', userData)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Connexion
  async login(credentials) {
    const response = await api.post('/login', credentials)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  // Déconnexion
  async logout() {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },

  // Récupérer l'utilisateur courant
  async getCurrentUser() {
    const response = await api.get('/user')
    return response.data
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  // Récupérer le token
  getToken() {
    return localStorage.getItem('auth_token')
  },

  // Récupérer l'utilisateur depuis le localStorage
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

export default authService
