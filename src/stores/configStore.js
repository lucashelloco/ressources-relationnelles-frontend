import { defineStore } from 'pinia'
import { ref } from 'vue'
import configService from '@/services/configService'

export const useConfigStore = defineStore('config', () => {
  const config = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchConfig() {
    if (config.value) return // Déjà chargé

    loading.value = true
    error.value = null
    try {
      const data = await configService.getConfig()
      config.value = data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de la configuration'
      console.error('Erreur fetchConfig:', err)
    } finally {
      loading.value = false
    }
  }

  // Getters pour accès facile aux options
  const typesRessource = () => config.value?.types_ressource || []
  const typesRelation = () => config.value?.types_relation || []
  const niveaux = () => config.value?.niveaux || []
  const niveauxPartage = () => config.value?.niveaux_partage || []
  const typesActivite = () => config.value?.types_activite || []
  const statutsActivite = () => config.value?.statuts_activite || []

  return {
    config,
    loading,
    error,
    fetchConfig,
    typesRessource,
    typesRelation,
    niveaux,
    niveauxPartage,
    typesActivite,
    statutsActivite
  }
})
