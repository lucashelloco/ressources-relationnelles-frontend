import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useActiviteStore = defineStore('activite', () => {
  const activites = ref([])
  const currentActivite = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchActivites(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/activites', { params })
      // L'API retourne { success: true, data: paginatedData }
      // paginatedData contient { data: [...], current_page, last_page, etc. }
      const paginatedData = response.data.data
      activites.value = paginatedData.data || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des activités'
      console.error('Erreur fetchActivites:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchActiviteById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/activites/${id}`)
      currentActivite.value = response.data.data
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Activité non trouvée'
      console.error('Erreur fetchActiviteById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function inscrireActivite(id) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/activites/${id}/inscription`)
      // Mettre à jour le nombre de places restantes
      if (currentActivite.value?.id === id) {
        currentActivite.value.places_restantes -= 1
      }
      const activite = activites.value.find(a => a.id === id)
      if (activite) {
        activite.places_restantes -= 1
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
      console.error('Erreur inscrireActivite:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    activites,
    currentActivite,
    loading,
    error,
    fetchActivites,
    fetchActiviteById,
    inscrireActivite
  }
})