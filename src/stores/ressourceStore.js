import { defineStore } from 'pinia'
import { ref } from 'vue'
import ressourceService from '@/services/ressourceService'

export const useRessourceStore = defineStore('ressource', () => {
  const ressources = ref([])
  const currentRessource = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  async function fetchRessources(params = {}) {
    loading.value = true
    error.value = null
    try {
      const data = await ressourceService.getAll(params)
      ressources.value = data.data.data
      pagination.value = {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRessourceById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await ressourceService.getById(id)
      currentRessource.value = data.data
      return data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Ressource non trouvée'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRessource(ressource) {
    loading.value = true
    error.value = null
    try {
      const data = await ressourceService.create(ressource)
      ressources.value.unshift(data.data)
      return data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRessource(id, ressource) {
    loading.value = true
    error.value = null
    try {
      const data = await ressourceService.update(id, ressource)
      const index = ressources.value.findIndex(r => r.id === id)
      if (index !== -1) {
        ressources.value[index] = data.data
      }
      if (currentRessource.value?.id === id) {
        currentRessource.value = data.data
      }
      return data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRessource(id) {
    loading.value = true
    error.value = null
    try {
      await ressourceService.delete(id)
      ressources.value = ressources.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleFavoris(id) {
    try {
      const data = await ressourceService.toggleFavoris(id)
      // Mettre à jour le compteur de favoris dans la liste
      const ressource = ressources.value.find(r => r.id === id)
      if (ressource && data.data) {
        ressource.nb_favoris = data.data.nb_favoris
      }
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    ressources,
    currentRessource,
    loading,
    error,
    pagination,
    fetchRessources,
    fetchRessourceById,
    createRessource,
    updateRessource,
    deleteRessource,
    toggleFavoris
  }
})
