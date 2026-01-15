<template>
  <div class="fr-container fr-py-6">
    <!-- En-tête -->
    <div class="fr-grid-row fr-mb-6">
      <div class="fr-col-12">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <h1 class="fr-h1" style="margin: 0;">Ressources</h1>
          <router-link to="/ressources/new" class="fr-btn fr-btn--icon-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nouvelle ressource
          </router-link>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="fr-card fr-mb-6">
      <div class="fr-card__body">
        <div class="fr-grid-row" style="row-gap: 1rem;">
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-input-group">
              <label class="fr-label" for="search">Rechercher</label>
              <input
                id="search"
                v-model="filters.search"
                type="text"
                class="fr-input"
                placeholder="Titre, description..."
              />
            </div>
          </div>
          
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <div class="fr-input-group">
              <label class="fr-label" for="type">Type de ressource</label>
              <select id="type" v-model="filters.type" class="fr-select">
                <option value="">Tous les types</option>
                <option value="article">Article</option>
                <option value="video">Vidéo</option>
                <option value="podcast">Podcast</option>
                <option value="audio">Audio</option>
                <option value="document">Document</option>
                <option value="lien">Lien</option>
                <option value="infographie">Infographie</option>
                <option value="guide">Guide</option>
                <option value="etude">Étude</option>
              </select>
            </div>
          </div>
          
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <div class="fr-input-group">
              <label class="fr-label" for="niveau">Niveau</label>
              <select id="niveau" v-model="filters.niveau" class="fr-select">
                <option value="">Tous les niveaux</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" style="display: flex; justify-content: center; padding: 3rem 0;">
      <div class="fr-spinner"></div>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="filteredRessources.length === 0" style="text-align: center; padding: 3rem 0;">
      <p class="fr-text fr-text--lg fr-text--mention">Aucune ressource trouvée</p>
    </div>

    <!-- Liste des ressources -->
    <div v-else class="fr-grid-row" style="row-gap: 1.5rem;">
      <div
        v-for="ressource in filteredRessources"
        :key="ressource.id"
        class="fr-col-12 fr-col-md-6 fr-col-lg-4"
      >
        <article 
          class="fr-card"
          style="cursor: pointer; height: 100%;"
          @click="$router.push(`/ressources/${ressource.id}`)"
        >
          <div v-if="ressource.url_image" style="position: relative;">
            <img 
              :src="ressource.url_image" 
              :alt="ressource.titre"
              class="fr-card__img"
            />
          </div>
          <div v-else style="height: 12rem; background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%);"></div>
          
          <div class="fr-card__body">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span class="fr-badge fr-badge--info">
                {{ formatType(ressource.type_ressource) }}
              </span>
              <span class="fr-badge fr-badge--success">
                {{ formatNiveau(ressource.niveau) }}
              </span>
              <span v-if="ressource.statut === 'publie'" class="fr-badge" style="background-color: #C3FAE8; color: var(--green-menthe);">
                Publié
              </span>
            </div>
            
            <h2 class="fr-card__title">
              {{ ressource.titre }}
            </h2>
            
            <p class="fr-card__desc" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              {{ ressource.description }}
            </p>
          </div>
          
          <div class="fr-card__footer">
            <span class="fr-text fr-text--sm" style="display: flex; align-items: center; gap: 0.25rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {{ ressource.nb_vues || 0 }}
            </span>
            <span class="fr-text fr-text--sm" style="display: flex; align-items: center; gap: 0.25rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {{ ressource.nb_favoris || 0 }}
            </span>
            <span v-if="ressource.duree_lecture" class="fr-text fr-text--sm" style="display: flex; align-items: center; gap: 0.25rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ ressource.duree_lecture }} min
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const ressources = ref([])

const filters = ref({
  search: '',
  type: '',
  niveau: ''
})

const filteredRessources = computed(() => {
  return ressources.value.filter(ressource => {
    const matchSearch = !filters.value.search || 
      ressource.titre.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      ressource.description?.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchType = !filters.value.type || ressource.type_ressource === filters.value.type
    const matchNiveau = !filters.value.niveau || ressource.niveau === filters.value.niveau
    
    return matchSearch && matchType && matchNiveau
  })
})

const formatType = (type) => {
  const types = {
    article: 'Article',
    video: 'Vidéo',
    podcast: 'Podcast',
    audio: 'Audio',
    document: 'Document',
    lien: 'Lien',
    infographie: 'Infographie',
    guide: 'Guide',
    etude: 'Étude'
  }
  return types[type] || type
}

const formatNiveau = (niveau) => {
  const niveaux = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé'
  }
  return niveaux[niveau] || niveau
}

onMounted(async () => {
  try {
    // Simuler le chargement depuis l'API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Données d'exemple
    ressources.value = [
      {
        id: 1,
        titre: 'Guide de la communication bienveillante',
        description: 'Découvrez les principes de base de la communication non-violente et comment les appliquer au quotidien.',
        type_ressource: 'guide',
        niveau: 'debutant',
        statut: 'publie',
        nb_vues: 1245,
        nb_favoris: 89,
        duree_lecture: 15,
        url_image: null
      },
      {
        id: 2,
        titre: 'Les bases de l\'écoute active',
        description: 'Apprenez à vraiment écouter l\'autre et à créer un espace de dialogue authentique.',
        type_ressource: 'article',
        niveau: 'debutant',
        statut: 'publie',
        nb_vues: 892,
        nb_favoris: 45,
        duree_lecture: 8,
        url_image: null
      },
      {
        id: 3,
        titre: 'Gérer les conflits familiaux',
        description: 'Stratégies avancées pour désamorcer les tensions et trouver des solutions constructives.',
        type_ressource: 'video',
        niveau: 'intermediaire',
        statut: 'publie',
        nb_vues: 2150,
        nb_favoris: 156,
        duree_lecture: 25,
        url_image: null
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>