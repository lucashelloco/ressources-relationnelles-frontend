import api from './api'

export const activiteService = {
  // Liste des activités
  async getAll(params = {}) {
    const response = await api.get('/activites', { params })
    return response.data
  },

  // Détail d'une activité
  async getById(id) {
    const response = await api.get(`/activites/${id}`)
    return response.data
  },

  // Créer une activité
  async create(activite) {
    const response = await api.post('/activites', activite)
    return response.data
  },

  // Modifier une activité
  async update(id, activite) {
    const response = await api.put(`/activites/${id}`, activite)
    return response.data
  },

  // Supprimer une activité
  async delete(id) {
    const response = await api.delete(`/activites/${id}`)
    return response.data
  },

  // S'inscrire à une activité
  async inscrire(id) {
    const response = await api.post(`/activites/${id}/inscription`)
    return response.data
  },

  // Se désinscrire d'une activité
  async desinscrire(id) {
    const response = await api.delete(`/activites/${id}/inscription`)
    return response.data
  },

  // Liste des participants
  async getParticipants(id) {
    const response = await api.get(`/activites/${id}/participants`)
    return response.data
  },

  // Messages de l'activité
  async getMessages(id) {
    const response = await api.get(`/activites/${id}/messages`)
    return response.data
  },

  // Envoyer un message
  async sendMessage(id, message) {
    const response = await api.post(`/activites/${id}/messages`, { contenu: message })
    return response.data
  }
}

export default activiteService
