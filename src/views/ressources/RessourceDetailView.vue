<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="ressource" class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div v-if="ressource.url_image" class="h-96 bg-gray-200">
          <img :src="ressource.url_image" :alt="ressource.titre" class="w-full h-full object-cover" />
        </div>

        <div class="p-8">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              {{ ressource.type_ressource }}
            </span>
            <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
              {{ ressource.niveau }}
            </span>
            <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded">
              {{ ressource.statut }}
            </span>
          </div>

          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ ressource.titre }}</h1>

          <div class="flex items-center gap-6 text-gray-600 mb-6">
            <span>👁 {{ ressource.nb_vues }} vues</span>
            <span>❤️ {{ ressource.nb_favoris }} favoris</span>
            <span v-if="ressource.duree_lecture">⏱ {{ ressource.duree_lecture }} min</span>
          </div>

          <div class="prose max-w-none mb-8">
            <p class="text-lg text-gray-700 mb-4">{{ ressource.description }}</p>
            <div v-if="ressource.contenu" v-html="ressource.contenu" class="text-gray-800"></div>
          </div>

          <div v-if="ressource.url_externe" class="mb-8">
            <a
              :href="ressource.url_externe"
              target="_blank"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              🔗 Voir la ressource externe
            </a>
          </div>

          <div class="flex gap-4">
            <button
              @click="toggleFavori"
              class="flex-1 bg-red-100 hover:bg-red-200 text-red-800 px-6 py-3 rounded-lg transition"
            >
              {{ isFavori ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris' }}
            </button>
            <router-link
              :to="`/ressources/${ressource.id}/edit`"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition text-center"
            >
              ✏️ Modifier
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Ressource introuvable</p>
      <router-link to="/ressources" class="text-blue-600 hover:underline mt-4 inline-block">
        ← Retour aux ressources
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRessourcesStore } from '@/stores/ressources'

const route = useRoute()
const ressourcesStore = useRessourcesStore()

const ressource = ref(null)
const loading = ref(true)
const isFavori = ref(false)

const toggleFavori = () => {
  isFavori.value = !isFavori.value
  // TODO: Appeler l'API pour ajouter/retirer des favoris
}

onMounted(async () => {
  const id = route.params.id
  ressource.value = await ressourcesStore.fetchRessource(id)
  loading.value = false
})
</script>
