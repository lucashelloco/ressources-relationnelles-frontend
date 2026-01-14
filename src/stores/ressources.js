import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const useRessourcesStore = defineStore('ressources', {
  state: () => ({
    ressources: [],
    currentRessource: null,
    loading: false,
    error: null
  }),

  getters: {
    getRessourceById: (state) => (id) => {
      return state.ressources.find(r => r.id === parseInt(id))
    }
  },

  actions: {
    async fetchRessources() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/ressources`)
        // Laravel retourne une pagination : response.data.data.data
        this.ressources = response.data.data.data || response.data.data || []
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la récupération des ressources:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchRessource(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/ressources/${id}`)
        this.currentRessource = response.data.data
        return this.currentRessource
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la récupération de la ressource:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async createRessource(data) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/ressources`, data)
        this.ressources.push(response.data.data)
        return response.data.data
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la création de la ressource:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRessource(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`${API_URL}/ressources/${id}`, data)
        const index = this.ressources.findIndex(r => r.id === parseInt(id))
        if (index !== -1) {
          this.ressources[index] = response.data.data
        }
        return response.data.data
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la mise à jour de la ressource:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRessource(id) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/ressources/${id}`)
        this.ressources = this.ressources.filter(r => r.id !== parseInt(id))
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la suppression de la ressource:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
