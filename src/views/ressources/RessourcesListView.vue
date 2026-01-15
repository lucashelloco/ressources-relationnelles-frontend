<template>
  <div class="fr-container fr-py-6">
    <h1 class="fr-h1" style="margin-bottom: 2rem;">Toutes les ressources</h1>

    <!-- Filtres -->
    <div class="fr-card fr-mb-4">
      <div class="fr-card__body">
        <h2 class="fr-h6" style="margin-bottom: 1rem;">Filtrer les ressources</h2>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3">
            <div class="fr-input-group">
              <label class="fr-label" for="search">Recherche</label>
              <input 
                id="search"
                v-model="filters.search" 
                type="text" 
                class="fr-input" 
                placeholder="Mot-clé..."
                @input="debounceSearch"
              >
            </div>
          </div>

          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3">
            <div class="fr-input-group">
              <label class="fr-label" for="categorie">Catégorie</label>
              <select id="categorie" v-model="filters.categorie" class="fr-select" @change="applyFilters">
                <option value="">Toutes les catégories</option>
                <option v-for="cat in categorieStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.nom }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3">
            <div class="fr-input-group">
              <label class="fr-label" for="type">Type de ressource</label>
              <select id="type" v-model="filters.type" class="fr-select" @change="applyFilters">
                <option value="">Tous les types</option>
                <option v-for="type in configStore.typesRessource()" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3">
            <div class="fr-input-group">
              <label class="fr-label" for="niveau">Niveau</label>
              <select id="niveau" v-model="filters.niveau" class="fr-select" @change="applyFilters">
                <option value="">Tous les niveaux</option>
                <option v-for="niveau in configStore.niveaux()" :key="niveau.value" :value="niveau.value">
                  {{ niveau.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="ressourceStore.loading" style="display: flex; justify-content: center; padding: 3rem 0;">
      <div class="fr-spinner"></div>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="ressourceStore.error" class="fr-alert fr-alert--error fr-mb-4">
      <p>{{ ressourceStore.error }}</p>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="ressourceStore.ressources.length === 0" style="text-align: center; padding: 3rem 0;">
      <p class="fr-text fr-text--lg fr-text--mention">Aucune ressource trouvée</p>
    </div>

    <!-- Liste des ressources -->
    <div v-else>
      <div class="fr-grid-row" style="row-gap: 1.5rem; margin-bottom: 2rem;">
        <div
          v-for="ressource in ressourceStore.ressources"
          :key="ressource.id"
          class="fr-col-12 fr-col-md-6 fr-col-lg-4"
        >
          <article 
            class="fr-card"
            style="cursor: pointer; height: 100%;"
            @click="$router.push(`/ressources/${ressource.id}`)"
          >
            <div v-if="ressource.url_image_couverture" style="position: relative;">
              <img 
                :src="ressource.url_image_couverture" 
                :alt="ressource.titre"
                class="fr-card__img"
              />
            </div>
            <div v-else style="height: 12rem; background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%);"></div>
            
            <div class="fr-card__body">
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                <span class="fr-badge fr-badge--sm fr-badge--blue-ecume">
                  {{ formatType(ressource.type_ressource) }}
                </span>
                <span class="fr-badge fr-badge--sm">
                  {{ formatNiveau(ressource.niveau) }}
                </span>
              </div>
              
              <h3 class="fr-card__title">
                {{ ressource.titre }}
              </h3>
              
              <p class="fr-card__desc">
                {{ ressource.description }}
              </p>

              <!-- Catégories -->
              <div v-if="ressource.categories && ressource.categories.length > 0" 
                style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
                <span 
                  v-for="cat in ressource.categories.slice(0, 2)" 
                  :key="cat.id"
                  class="fr-badge fr-badge--sm fr-badge--green-menthe"
                >
                  {{ cat.nom }}
                </span>
                <span 
                  v-if="ressource.categories.length > 2"
                  class="fr-badge fr-badge--sm"
                >
                  +{{ ressource.categories.length - 2 }}
                </span>
              </div>
            </div>
            
            <div class="fr-card__footer">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="fr-text fr-text--sm fr-text--mention">
                  {{ ressource.duree_estimee || 0 }} min
                </span>
                <div style="display: flex; gap: 1rem;">
                  <span class="fr-text fr-text--sm fr-text--mention">
                    👁️ {{ ressource.nb_vues || 0 }}
                  </span>
                  <span class="fr-text fr-text--sm fr-text--mention">
                    ❤️ {{ ressource.nb_favoris || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="ressourceStore.pagination.last_page > 1" 
        role="navigation" 
        class="fr-pagination" 
        aria-label="Pagination"
      >
        <ul class="fr-pagination__list">
          <li v-if="ressourceStore.pagination.current_page > 1">
            <a 
              class="fr-pagination__link fr-pagination__link--prev"
              @click.prevent="changePage(ressourceStore.pagination.current_page - 1)"
            >
              Page précédente
            </a>
          </li>
          
          <li v-for="page in paginationPages" :key="page">
            <a 
              v-if="page !== '...'"
              class="fr-pagination__link"
              :class="{ 'fr-pagination__link--active': page === ressourceStore.pagination.current_page }"
              :aria-current="page === ressourceStore.pagination.current_page ? 'page' : undefined"
              @click.prevent="changePage(page)"
            >
              {{ page }}
            </a>
            <span v-else class="fr-pagination__link">...</span>
          </li>
          
          <li v-if="ressourceStore.pagination.current_page < ressourceStore.pagination.last_page">
            <a 
              class="fr-pagination__link fr-pagination__link--next"
              @click.prevent="changePage(ressourceStore.pagination.current_page + 1)"
            >
              Page suivante
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRessourceStore } from '@/stores/ressourceStore'
import { useCategorieStore } from '@/stores/categorieStore'
import { useConfigStore } from '@/stores/configStore'
import { formatType, formatNiveau } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const ressourceStore = useRessourceStore()
const categorieStore = useCategorieStore()
const configStore = useConfigStore()

const filters = ref({
  search: route.query.search || '',
  categorie: route.query.categorie || '',
  type: route.query.type_ressource || '',
  niveau: route.query.niveau || ''
})

let searchTimeout = null

const paginationPages = computed(() => {
  const current = ressourceStore.pagination.current_page
  const last = ressourceStore.pagination.last_page
  const pages = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < last - 2) {
      pages.push('...')
    }
    
    pages.push(last)
  }
  
  return pages
})

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = async () => {
  const params = {
    page: 1
  }
  
  if (filters.value.search) params.search = filters.value.search
  if (filters.value.categorie) params.categorie_id = filters.value.categorie
  if (filters.value.type) params.type_ressource = filters.value.type
  if (filters.value.niveau) params.niveau = filters.value.niveau
  
  // Mettre à jour l'URL
  router.push({ query: params })
  
  // Charger les ressources
  await ressourceStore.fetchRessources(params)
}

const changePage = async (page) => {
  const params = { ...route.query, page }
  router.push({ query: params })
  await ressourceStore.fetchRessources(params)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Surveiller les changements de route pour recharger les ressources
watch(() => route.query, async (newQuery) => {
  if (route.name === 'ressources') {
    await ressourceStore.fetchRessources(newQuery)
  }
})

onMounted(async () => {
  // Charger la configuration
  await configStore.fetchConfig()

  // Charger les catégories pour les filtres
  await categorieStore.fetchCategories()

  // Charger les ressources avec les paramètres de l'URL
  await ressourceStore.fetchRessources(route.query)
})
</script>


