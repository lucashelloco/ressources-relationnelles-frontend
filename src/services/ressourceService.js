import api from './api'

export const ressourceService = {
  // Liste des ressources avec filtres
  async getAll(params = {}) {
    const response = await api.get('/ressources', { params })
    return response.data
  },

  // Détail d'une ressource
  async getById(id) {
    const response = await api.get(`/ressources/${id}`)
    return response.data
  },

  // Créer une ressource
  async create(ressource) {
    const response = await api.post('/ressources', ressource)
    return response.data
  },

  // Modifier une ressource
  async update(id, ressource) {
    const response = await api.put(`/ressources/${id}`, ressource)
    return response.data
  },

  // Supprimer une ressource
  async delete(id) {
    const response = await api.delete(`/ressources/${id}`)
    return response.data
  },

  // Ajouter/retirer des favoris
  async toggleFavoris(id) {
    const response = await api.post(`/ressources/${id}/favoris`)
    return response.data
  },

  // Publier une ressource
  async publier(id) {
    const response = await api.post(`/ressources/${id}/publier`)
    return response.data
  }
}

export default ressourceService
