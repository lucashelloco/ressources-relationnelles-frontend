import api from './api'

export const commentaireService = {
  // Liste des commentaires approuvés d'une ressource
  async getCommentaires(ressourceId) {
    const response = await api.get(`/ressources/${ressourceId}/commentaires`)
    return response.data
  },

  // Créer un commentaire
  async creerCommentaire(ressourceId, data) {
    const response = await api.post(`/ressources/${ressourceId}/commentaires`, data)
    return response.data
  },

  // Modifier un commentaire
  async modifierCommentaire(ressourceId, commentaireId, data) {
    const response = await api.put(`/ressources/${ressourceId}/commentaires/${commentaireId}`, data)
    return response.data
  },

  // Supprimer un commentaire
  async supprimerCommentaire(ressourceId, commentaireId) {
    const response = await api.delete(`/ressources/${ressourceId}/commentaires/${commentaireId}`)
    return response.data
  }
}

export default commentaireService
