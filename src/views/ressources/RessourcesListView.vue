<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Ressources</h1>
      <router-link
        to="/ressources/new"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
      >
        + Nouvelle ressource
      </router-link>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          v-model="filters.type"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les types</option>
          <option value="article">Article</option>
          <option value="video">Vidéo</option>
          <option value="podcast">Podcast</option>
          <option value="guide">Guide</option>
        </select>
        <select
          v-model="filters.niveau"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tous les niveaux</option>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>
      </div>
    </div>

    <!-- Liste des ressources -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="filteredRessources.length === 0" class="text-center py-12 text-gray-500">
      Aucune ressource trouvée
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ressource in filteredRessources"
        :key="ressource.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
        @click="$router.push(`/ressources/${ressource.id}`)"
      >
        <div v-if="ressource.url_image" class="h-48 bg-gray-200">
          <img :src="ressource.url_image" :alt="ressource.titre" class="w-full h-full object-cover" />
        </div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {{ ressource.type_ressource }}
            </span>
            <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              {{ ressource.niveau }}
            </span>
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ ressource.titre }}</h3>
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ ressource.description }}</p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>👁 {{ ressource.nb_vues }} vues</span>
            <span>❤️ {{ ressource.nb_favoris }} favoris</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRessourcesStore } from '@/stores/ressources'

const ressourcesStore = useRessourcesStore()
const loading = ref(true)
const filters = ref({
  search: '',
  type: '',
  niveau: ''
})

const filteredRessources = computed(() => {
  let result = ressourcesStore.ressources

  if (filters.value.search) {
    result = result.filter(r =>
      r.titre.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      r.description?.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.type) {
    result = result.filter(r => r.type_ressource === filters.value.type)
  }

  if (filters.value.niveau) {
    result = result.filter(r => r.niveau === filters.value.niveau)
  }

  return result
})

onMounted(async () => {
  await ressourcesStore.fetchRessources()
  loading.value = false
})
</script>
