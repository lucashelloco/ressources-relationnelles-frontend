<template>
  <div class="card-dsfr hover:shadow-lg transition-all cursor-pointer group overflow-hidden" @click="goToDetail">
    <!-- Image de couverture -->
    <div class="relative -mx-6 -mt-6 mb-4">
      <div v-if="ressource.url_image" class="h-40 sm:h-48 bg-gris-bg overflow-hidden">
        <img 
          :src="ressource.url_image" 
          :alt="ressource.titre"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImageError"
        />
      </div>
      <div v-else class="h-40 sm:h-48 bg-gradient-to-br from-bleu-france to-bleu-ciel flex items-center justify-center">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    </div>

    <!-- Type et niveau -->
    <div class="flex items-center gap-2 mb-3 flex-wrap">
      <span :class="getBadgeClass(ressource.type_ressource)" class="text-xs">
        {{ getTypeLabel(ressource.type_ressource) }}
      </span>
      <span v-if="ressource.niveau" class="badge badge-success text-xs">
        {{ getNiveauLabel(ressource.niveau) }}
      </span>
    </div>

    <!-- Titre -->
    <h3 class="text-base sm:text-lg font-semibold mb-2 line-clamp-2 text-bleu-france">
      {{ ressource.titre }}
    </h3>

    <!-- Description -->
    <p class="text-gris-neutre text-sm mb-4 line-clamp-2 sm:line-clamp-3">
      {{ ressource.description }}
    </p>

    <!-- Métadonnées -->
    <div class="flex items-center justify-between text-xs sm:text-sm text-gris-sombre pt-3 sm:pt-4 border-t border-gris-clair">
      <div class="flex items-center space-x-3 sm:space-x-4">
        <!-- Vues -->
        <div class="flex items-center space-x-1">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{{ formatNumber(ressource.nb_vues || 0) }}</span>
        </div>

        <!-- Favoris -->
        <div class="flex items-center space-x-1">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ formatNumber(ressource.nb_favoris || 0) }}</span>
        </div>
      </div>

      <!-- Durée estimée -->
      <div v-if="ressource.duree_lecture" class="text-xs hidden sm:block">
        ⏱ {{ ressource.duree_lecture }} min
      </div>
    </div>

    <!-- Auteur -->
    <div v-if="ressource.auteur" class="flex items-center mt-3 pt-3 border-t border-gris-clair">
      <div class="w-7 h-7 sm:w-8 sm:h-8 bg-bleu-france bg-opacity-10 rounded-full flex items-center justify-center mr-2 border-2 border-bleu-france flex-shrink-0">
        <span class="text-bleu-france font-semibold text-xs">
          {{ ressource.auteur?.prenom?.[0] }}{{ ressource.auteur?.nom?.[0] }}
        </span>
      </div>
      <div class="text-xs sm:text-sm min-w-0">
        <p class="text-gris-fonce font-medium truncate">
          {{ ressource.auteur?.prenom }} {{ ressource.auteur?.nom }}
        </p>
        <p class="text-gris-sombre text-xs">
          {{ formatDate(ressource.date_publication) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  ressource: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToDetail = () => {
  router.push(`/ressources/${props.ressource.id}`)
}

const getBadgeClass = (type) => {
  const classes = {
    article: 'badge badge-primary',
    video: 'badge bg-rouge-marianne bg-opacity-10 text-rouge-marianne',
    podcast: 'badge bg-purple-100 text-purple-800',
    guide: 'badge bg-bleu-ciel bg-opacity-20 text-bleu-ciel',
    infographie: 'badge bg-orange-warning bg-opacity-20 text-orange-warning',
    etude: 'badge badge-primary'
  }
  return classes[type] || 'badge badge-primary'
}

const getTypeLabel = (type) => {
  const labels = {
    article: 'Article',
    video: 'Vidéo',
    podcast: 'Podcast',
    guide: 'Guide',
    infographie: 'Infographie',
    etude: 'Étude'
  }
  return labels[type] || type
}

const getNiveauLabel = (niveau) => {
  const labels = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé'
  }
  return labels[niveau] || niveau
}

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return d.toLocaleDateString('fr-FR', options)
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  parent.innerHTML = `
    <div class="h-full bg-gradient-to-br from-bleu-france to-bleu-ciel flex items-center justify-center">
      <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  `
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