import api from './api'

export const configService = {
  // Récupérer toutes les options de configuration
  async getConfig() {
    const response = await api.get('/config')
    return response.data
  }
}

export default configService
