import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useCategorieStore = defineStore('categorie', () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/categories')
      categories.value = response.data.data || response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des catégories'
      console.error('Erreur fetchCategories:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
})