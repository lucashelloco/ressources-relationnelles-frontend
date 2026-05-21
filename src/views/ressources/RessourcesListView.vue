<template>
  <div class="container-app" style="padding-top:1.75rem;padding-bottom:2.5rem;">

    <h1 style="font-size:1.5rem;font-weight:800;color:#161616;margin-bottom:1.5rem;">Toutes les ressources</h1>

    <!-- Filtres -->
    <div style="background:#FFFFFF;border:1px solid #DDDDDD;border-radius:4px;padding:1.25rem;margin-bottom:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,.04);">
      <div style="display:grid;grid-template-columns:1fr;gap:.75rem;" class="sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label style="display:block;color:#161616;font-size:.75rem;font-weight:500;margin-bottom:.3rem;">Recherche</label>
          <input
            v-model="filters.search"
            type="text"
            class="input-dsfr"
            placeholder="Mot-clé..."
            @input="debounceSearch"
          />
        </div>
        <div>
          <label style="display:block;color:#161616;font-size:.75rem;font-weight:500;margin-bottom:.3rem;">Catégorie</label>
          <select v-model="filters.categorie" class="input-dsfr" @change="applyFilters">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categorieStore.categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
          </select>
        </div>
        <div>
          <label style="display:block;color:#161616;font-size:.75rem;font-weight:500;margin-bottom:.3rem;">Type</label>
          <select v-model="filters.type" class="input-dsfr" @change="applyFilters">
            <option value="">Tous les types</option>
            <option v-for="t in configStore.typesRessource()" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div>
          <label style="display:block;color:#161616;font-size:.75rem;font-weight:500;margin-bottom:.3rem;">Niveau</label>
          <select v-model="filters.niveau" class="input-dsfr" @change="applyFilters">
            <option value="">Tous les niveaux</option>
            <option v-for="n in configStore.niveaux()" :key="n.value" :value="n.value">{{ n.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="ressourceStore.loading" style="display:flex;justify-content:center;padding:4rem 0;">
      <div class="fr-spinner" style="width:2.5rem;height:2.5rem;border-width:4px;"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="ressourceStore.error" style="background:#FFE9E9;border:1px solid #E1000F;border-left-width:4px;border-radius:3px;padding:1rem 1.25rem;margin-bottom:1rem;">
      <p style="margin:0;color:#C9191E;font-size:.875rem;">{{ ressourceStore.error }}</p>
    </div>

    <!-- Vide -->
    <div v-else-if="ressourceStore.ressources.length === 0" style="text-align:center;padding:4rem 2rem;">
      <svg style="width:3rem;height:3rem;color:#CECECE;margin:0 auto 1rem;display:block;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p style="margin:0;color:#666666;font-size:.9rem;">Aucune ressource trouvée</p>
    </div>

    <!-- Grille -->
    <div v-else>
      <p style="color:#666666;font-size:.8rem;margin-bottom:1.25rem;">
        {{ ressourceStore.pagination.total || ressourceStore.ressources.length }} ressource{{ (ressourceStore.pagination.total || ressourceStore.ressources.length) > 1 ? 's' : '' }}
      </p>

      <div style="display:grid;grid-template-columns:1fr;gap:1rem;" class="sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="r in ressourceStore.ressources"
          :key="r.id"
          style="background:#FFFFFF;border:1px solid #DDDDDD;border-radius:4px;overflow:hidden;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;"
          @click="$router.push(`/ressources/${r.id}`)"
          @mouseover="e=>{ e.currentTarget.style.borderColor='#000091'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,145,.1)'; }"
          @mouseleave="e=>{ e.currentTarget.style.borderColor='#DDDDDD'; e.currentTarget.style.boxShadow='none'; }"
        >
          <!-- Image / fallback -->
          <div v-if="r.url_image_couverture" style="height:9rem;overflow:hidden;">
            <img :src="r.url_image_couverture" :alt="r.titre" style="width:100%;height:100%;object-fit:cover;" />
          </div>
          <div v-else style="height:6rem;background:linear-gradient(135deg,rgba(0,0,145,.07),rgba(0,0,145,.03));display:flex;align-items:center;justify-content:center;">
            <svg style="width:2rem;height:2rem;color:#000091;opacity:.3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>

          <!-- Contenu -->
          <div style="padding:1rem;flex:1;display:flex;flex-direction:column;">
            <div style="display:flex;gap:.375rem;flex-wrap:wrap;margin-bottom:.625rem;">
              <span style="display:inline-flex;align-items:center;padding:.2rem .5rem;background:#E3E8F7;color:#000091;border-radius:3px;font-size:.7rem;font-weight:500;">{{ formatType(r.type_ressource) }}</span>
              <span style="display:inline-flex;align-items:center;padding:.2rem .5rem;background:#C3FAE8;color:#009081;border-radius:3px;font-size:.7rem;font-weight:500;">{{ formatNiveau(r.niveau) }}</span>
            </div>

            <h3 style="font-size:.9rem;font-weight:600;color:#161616;margin:0 0 .375rem;line-height:1.4;">{{ r.titre }}</h3>
            <p style="font-size:.8rem;color:#666666;margin:0 0 .75rem;line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;flex:1;">{{ r.description }}</p>

            <!-- Tags catégories -->
            <div v-if="r.categories?.length" style="display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.625rem;">
              <span v-for="cat in r.categories.slice(0,2)" :key="cat.id" style="display:inline-flex;align-items:center;padding:.15rem .4rem;background:#E3E8F7;color:#465F9D;border-radius:3px;font-size:.65rem;">{{ cat.nom }}</span>
              <span v-if="r.categories.length > 2" style="display:inline-flex;align-items:center;padding:.15rem .4rem;background:#F5F5F5;color:#666666;border-radius:3px;font-size:.65rem;">+{{ r.categories.length - 2 }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding:.625rem 1rem;border-top:1px solid #EEEEEE;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:.7rem;color:#666666;">{{ r.duree_estimee || 0 }} min</span>
            <div style="display:flex;gap:.75rem;">
              <span style="font-size:.7rem;color:#666666;">{{ r.nb_vues || 0 }} vues</span>
              <span style="font-size:.7rem;color:#666666;">{{ r.nb_favoris || 0 }} favoris</span>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="ressourceStore.pagination.last_page > 1" class="pagination">
        <button @click="changePage(ressourceStore.pagination.current_page - 1)" :disabled="ressourceStore.pagination.current_page <= 1">
          ← Précédent
        </button>
        <button
          v-for="page in paginationPages"
          :key="page"
          @click="page !== '...' && changePage(page)"
          :class="{ active: page === ressourceStore.pagination.current_page }"
          :style="page === '...' ? 'cursor:default;' : ''"
        >
          {{ page }}
        </button>
        <button @click="changePage(ressourceStore.pagination.current_page + 1)" :disabled="ressourceStore.pagination.current_page >= ressourceStore.pagination.last_page">
          Suivant →
        </button>
      </div>
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
const configStore    = useConfigStore()

const filters = ref({
  search:    route.query.search          || '',
  categorie: route.query.categorie       || '',
  type:      route.query.type_ressource  || '',
  niveau:    route.query.niveau          || ''
})

let searchTimeout = null

const paginationPages = computed(() => {
  const cur = ressourceStore.pagination.current_page
  const last = ressourceStore.pagination.last_page
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++) pages.push(i)
  if (cur < last - 2) pages.push('...')
  pages.push(last)
  return pages
})

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(applyFilters, 500)
}

const applyFilters = async () => {
  const params = { page: 1 }
  if (filters.value.search)    params.search         = filters.value.search
  if (filters.value.categorie) params.categorie_id   = filters.value.categorie
  if (filters.value.type)      params.type_ressource = filters.value.type
  if (filters.value.niveau)    params.niveau         = filters.value.niveau
  router.push({ query: params })
  await ressourceStore.fetchRessources(params)
}

const changePage = async (page) => {
  router.push({ query: { ...route.query, page } })
  await ressourceStore.fetchRessources({ ...route.query, page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.query, async (q) => {
  if (route.name === 'ressources') await ressourceStore.fetchRessources(q)
})

onMounted(async () => {
  await configStore.fetchConfig()
  await categorieStore.fetchCategories()
  await ressourceStore.fetchRessources(route.query)
})
</script>

<style scoped>
@media (min-width:640px)  { .sm\:grid-cols-2 { grid-template-columns:repeat(2,1fr) !important; } }
@media (min-width:1024px) { .lg\:grid-cols-3 { grid-template-columns:repeat(3,1fr) !important; } }
@media (min-width:768px)  { .md\:grid-cols-4 { grid-template-columns:repeat(4,1fr) !important; } }
</style>
