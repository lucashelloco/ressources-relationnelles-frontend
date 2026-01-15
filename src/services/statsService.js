import api from './api'

export const statsService = {
  // Récupérer les statistiques globales
  async getStats() {
    const response = await api.get('/stats')
    return response.data
  }
}

export default statsService
