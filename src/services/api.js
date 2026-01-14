import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur 401 - Non authentifié
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        router.push('/login')
      }
      
      // Erreur 403 - Non autorisé
      if (error.response.status === 403) {
        console.error('Accès refusé')
      }
      
      // Erreur 404
      if (error.response.status === 404) {
        console.error('Ressource non trouvée')
      }
      
      // Erreur 422 - Validation
      if (error.response.status === 422) {
        console.error('Erreur de validation:', error.response.data.errors)
      }
      
      // Erreur 500
      if (error.response.status >= 500) {
        console.error('Erreur serveur')
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
