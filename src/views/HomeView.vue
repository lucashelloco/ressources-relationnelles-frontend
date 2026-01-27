<template>
  <div>
    <!-- Hero Section -->
    <section style="background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%); color: white; padding: 4rem 0;">
      <div class="fr-container">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h1 class="fr-h1" style="color: white; font-size: 3rem; margin-bottom: 1.5rem;">
            (RE)SOURCES RELATIONNELLES
          </h1>
          <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.95;">
            Améliorez vos relations grâce à des ressources expertes et une communauté bienveillante
          </p>
          <div v-if="!authStore?.isAuthenticated" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <router-link
              to="/inscription"
              class="fr-btn"
              style="background-color: white; color: var(--blue-france); border-color: white;"
            >
              Créer un compte
            </router-link>
            <router-link
              to="/connexion"
              class="fr-btn fr-btn--secondary"
              style="border-color: white; color: white;"
            >
              Se connecter
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistiques -->
    <section style="background-color: var(--grey-1000-50); padding: 3rem 0;">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3" style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700; color: var(--blue-france); margin-bottom: 0.5rem;">
              {{ stats.ressources }}+
            </div>
            <div class="fr-text fr-text--lg fr-text--mention">
              Ressources disponibles
            </div>
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3" style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700; color: var(--blue-france); margin-bottom: 0.5rem;">
              {{ stats.utilisateurs }}+
            </div>
            <div class="fr-text fr-text--lg fr-text--mention">
              Membres actifs
            </div>
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3" style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700; color: var(--blue-france); margin-bottom: 0.5rem;">
              {{ stats.activites }}+
            </div>
            <div class="fr-text fr-text--lg fr-text--mention">
              Activités organisées
            </div>
          </div>
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-3" style="text-align: center;">
            <div style="font-size: 3rem; font-weight: 700; color: var(--blue-france); margin-bottom: 0.5rem;">
              {{ stats.commentaires }}+
            </div>
            <div class="fr-text fr-text--lg fr-text--mention">
              Échanges partagés
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catégories principales -->
    <section class="fr-container fr-py-8">
      <h2 class="fr-h2" style="text-align: center; margin-bottom: 3rem;">
        Explorez par thématique
      </h2>
      
      <!-- État de chargement -->
      <div v-if="categorieStore.loading" style="display: flex; justify-content: center; padding: 3rem 0;">
        <div class="fr-spinner"></div>
      </div>
      
      <!-- Liste des catégories -->
      <div v-else class="fr-grid-row" style="row-gap: 1.5rem;">
        <div
          v-for="categorie in categorieStore.categories"
          :key="categorie.id"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <article 
            class="fr-card"
            style="cursor: pointer; height: 100%;"
            @click="naviguerCategorie(categorie.slug)"
          >
            <div style="height: 12rem; display: flex; align-items: center; justify-content: center; font-size: 4rem;"
              :style="{ background: `linear-gradient(135deg, ${categorie.couleur} 0%, ${categorie.couleur}CC 100%)` }">
              {{ categorie.icone }}
            </div>
            
            <div class="fr-card__body">
              <h3 class="fr-card__title">
                {{ categorie.nom }}
              </h3>
              <p class="fr-card__desc">
                {{ categorie.description }}
              </p>
            </div>
            
            <div class="fr-card__footer">
              <span class="fr-badge fr-badge--sm">
                {{ categorie.nb_ressources || 0 }} ressource{{ categorie.nb_ressources > 1 ? 's' : '' }}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Ressources récentes -->
    <section style="background-color: var(--grey-1000-50); padding: 4rem 0;">
      <div class="fr-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
          <h2 class="fr-h2" style="margin: 0;">
            Ressources récentes
          </h2>
          <router-link to="/ressources" class="fr-btn fr-btn--secondary">
            Voir toutes les ressources
          </router-link>
        </div>
        
        <!-- État de chargement -->
        <div v-if="loadingRessources" style="display: flex; justify-content: center; padding: 3rem 0;">
          <div class="fr-spinner"></div>
        </div>
        
        <!-- Liste des ressources -->
        <div v-else class="fr-grid-row" style="row-gap: 1.5rem;">
          <div
            v-for="ressource in ressourcesRecentes"
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
              </div>
              
              <div class="fr-card__footer">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="fr-text fr-text--sm fr-text--mention">
                    {{ ressource.duree_estimee }} min de lecture
                  </span>
                  <span class="fr-text fr-text--sm fr-text--mention">
                    👁️ {{ ressource.nb_vues || 0 }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section v-if="!authStore?.isAuthenticated" style="background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%); color: white; padding: 4rem 0; text-align: center;">
      <div class="fr-container">
        <div style="max-width: 700px; margin: 0 auto;">
          <h2 class="fr-h2" style="color: white; margin-bottom: 1.5rem;">
            Prêt à transformer vos relations ?
          </h2>
          <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.95;">
            Rejoignez notre communauté et accédez à des centaines de ressources
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <router-link
              to="/inscription"
              class="fr-btn"
              style="background-color: white; color: var(--blue-france); border-color: white;"
            >
              Créer un compte gratuitement
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCategorieStore } from '@/stores/categorieStore'
import { useRessourceStore } from '@/stores/ressourceStore'
import { formatType, formatNiveau } from '@/utils/formatters'
import statsService from '@/services/statsService'

const router = useRouter()
const authStore = useAuthStore()
const categorieStore = useCategorieStore()
const ressourceStore = useRessourceStore()

const loadingRessources = ref(true)
const loadingStats = ref(true)

const stats = ref({
  ressources: 0,
  utilisateurs: 0,
  activites: 0,
  commentaires: 0
})

const ressourcesRecentes = ref([])

const naviguerCategorie = (slug) => {
  router.push(`/ressources?categorie=${slug}`)
}

const chargerStats = async () => {
  try {
    loadingStats.value = true
    const data = await statsService.getStats()
    const targets = data.data

    // Animation des compteurs
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    Object.keys(targets).forEach(key => {
      const target = targets[key]
      const increment = target / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          stats.value[key] = target
          clearInterval(timer)
        } else {
          stats.value[key] = Math.floor(current)
        }
      }, interval)
    })
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loadingStats.value = false
  }
}

onMounted(async () => {
  try {
    // Charger les catégories
    await categorieStore.fetchCategories()

    // Charger les ressources récentes
    loadingRessources.value = true
    await ressourceStore.fetchRessources({
      per_page: 6,
      order_by: 'date_publication',
      order: 'desc'
    })
    ressourcesRecentes.value = ressourceStore.ressources.slice(0, 6)

    // Charger les statistiques
    await chargerStats()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loadingRessources.value = false
  }
})
</script>