<template>
  <div class="card hover:shadow-lg transition-shadow cursor-pointer" @click="goToDetail">
    <!-- Image de couverture -->
    <div v-if="ressource.url_image_couverture" class="mb-4 -mx-6 -mt-6">
      <img 
        :src="ressource.url_image_couverture" 
        :alt="ressource.titre"
        class="w-full h-48 object-cover rounded-t-xl"
      />
    </div>
    <div v-else class="mb-4 -mx-6 -mt-6 h-48 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-t-xl flex items-center justify-center">
      <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>

    <!-- Type et niveau -->
    <div class="flex items-center gap-2 mb-3">
      <span :class="getBadgeClass(ressource.type_ressource)">
        {{ getTypeLabel(ressource.type_ressource) }}
      </span>
      <span v-if="ressource.niveau" class="badge badge-gray text-xs">
        {{ getNiveauLabel(ressource.niveau) }}
      </span>
    </div>

    <!-- Titre -->
    <h3 class="text-lg font-semibold mb-2 line-clamp-2">
      {{ ressource.titre }}
    </h3>

    <!-- Description -->
    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
      {{ ressource.description }}
    </p>

    <!-- Métadonnées -->
    <div class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
      <div class="flex items-center space-x-4">
        <!-- Vues -->
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{{ ressource.nb_vues || 0 }}</span>
        </div>

        <!-- Favoris -->
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ ressource.nb_favoris || 0 }}</span>
        </div>
      </div>

      <!-- Durée estimée -->
      <div v-if="ressource.duree_estimee" class="text-xs">
        {{ ressource.duree_estimee }} min
      </div>
    </div>

    <!-- Auteur -->
    <div class="flex items-center mt-3 pt-3 border-t">
      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
        <span class="text-primary-700 font-semibold text-xs">
          {{ ressource.auteur?.prenom?.[0] }}{{ ressource.auteur?.nom?.[0] }}
        </span>
      </div>
      <div class="text-sm">
        <p class="text-gray-700 font-medium">
          {{ ressource.auteur?.prenom }} {{ ressource.auteur?.nom }}
        </p>
        <p class="text-gray-500 text-xs">
          {{ formatDate(ressource.date_publication) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps({
  ressource: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'ressource-detail', params: { id: props.ressource.id } })
}

const getBadgeClass = (type) => {
  const classes = {
    article: 'badge badge-primary',
    video: 'badge bg-red-100 text-red-800',
    audio: 'badge bg-purple-100 text-purple-800',
    document: 'badge bg-blue-100 text-blue-800',
    lien: 'badge bg-green-100 text-green-800',
    infographie: 'badge bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'badge badge-gray'
}

const getTypeLabel = (type) => {
  const labels = {
    article: 'Article',
    video: 'Vidéo',
    audio: 'Audio',
    document: 'Document',
    lien: 'Lien',
    infographie: 'Infographie'
  }
  return labels[type] || type
}

const getNiveauLabel = (niveau) => {
  const labels = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
    tous: 'Tous niveaux'
  }
  return labels[niveau] || niveau
}

const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'd MMMM yyyy', { locale: fr })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
