<template>
  <div>
    <!-- Hero Section -->
    <section style="background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%); color: white;">
      <div class="fr-container" style="padding-top: 4rem; padding-bottom: 4rem;">
        <div class="fr-grid-row" style="align-items: center; row-gap: 2rem;">
          <div class="fr-col-12 fr-col-md-6">
            <h1 style="font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem; color: white;">
              Ressources Relationnelles
            </h1>
            <p style="font-size: 1.25rem; line-height: 1.6; margin-bottom: 2rem; color: rgba(255,255,255,0.95);">
              Plateforme collaborative de partage et d'apprentissage pour améliorer vos relations personnelles et professionnelles.
            </p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <router-link 
                to="/ressources" 
                class="fr-btn"
                style="background-color: white; color: var(--blue-france); border-color: white;"
              >
                Découvrir les ressources
              </router-link>
              <router-link 
                to="/ressources/new" 
                class="fr-btn fr-btn--secondary"
                style="border-color: white; color: white;"
              >
                Partager une ressource
              </router-link>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-6 fr-hidden-mobile">
            <div style="background: rgba(255,255,255,0.1); border-radius: 1rem; padding: 3rem; backdrop-filter: blur(10px);">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" style="width: 100%; height: auto;">
                <circle cx="200" cy="150" r="100" fill="rgba(255,255,255,0.2)" />
                <circle cx="150" cy="120" r="60" fill="rgba(255,255,255,0.3)" />
                <circle cx="250" cy="180" r="70" fill="rgba(255,255,255,0.25)" />
                <circle cx="200" cy="150" r="40" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistiques -->
    <section style="background-color: var(--background-alt-grey); padding: 3rem 0;">
      <div class="fr-container">
        <div class="fr-grid-row" style="row-gap: 2rem;">
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
      <div class="fr-grid-row" style="row-gap: 1.5rem;">
        <div
          v-for="categorie in categories"
          :key="categorie.id"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <article 
            class="fr-card"
            style="cursor: pointer; height: 100%; transition: transform 0.2s ease;"
            @click="naviguerCategorie(categorie.slug)"
            @mouseenter="(e) => e.currentTarget.style.transform = 'translateY(-4px)'"
            @mouseleave="(e) => e.currentTarget.style.transform = 'translateY(0)'"
          >
            <div class="fr-card__body">
              <div 
                style="width: 4rem; height: 4rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; font-size: 2rem;"
                :style="{ backgroundColor: categorie.couleur + '20', color: categorie.couleur }"
              >
                {{ categorie.icone }}
              </div>
              <h3 class="fr-card__title">
                {{ categorie.nom }}
              </h3>
              <p class="fr-card__desc">
                {{ categorie.description }}
              </p>
              <div class="fr-badge fr-badge--info" style="margin-top: 0.75rem;">
                {{ categorie.nb_ressources }} ressources
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Ressources récentes -->
    <section style="background-color: var(--background-alt-grey);">
      <div class="fr-container fr-py-8">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <h2 class="fr-h2" style="margin: 0;">
            Ressources récentes
          </h2>
          <router-link to="/ressources" class="fr-btn fr-btn--secondary">
            Voir toutes les ressources
          </router-link>
        </div>
        
        <div v-if="loadingRessources" style="display: flex; justify-content: center; padding: 3rem 0;">
          <div class="fr-spinner"></div>
        </div>
        
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
                </div>
                
                <h3 class="fr-card__title">
                  {{ ressource.titre }}
                </h3>
                
                <p class="fr-card__desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
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
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Appel à l'action -->
    <section class="fr-container fr-py-8">
      <div class="fr-card" style="background: linear-gradient(135deg, var(--blue-france) 0%, var(--blue-france-sun-113) 100%); border: none; color: white;">
        <div class="fr-card__body" style="padding: 3rem; text-align: center;">
          <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: white;">
            Rejoignez notre communauté
          </h2>
          <p style="font-size: 1.125rem; margin-bottom: 2rem; max-width: 40rem; margin-left: auto; margin-right: auto; color: rgba(255,255,255,0.95);">
            Partagez vos connaissances, apprenez des autres et participez à la construction d'une plateforme dédiée aux relations humaines.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loadingRessources = ref(true)

const stats = ref({
  ressources: 0,
  utilisateurs: 0,
  activites: 0,
  commentaires: 0
})

const categories = ref([])
const ressourcesRecentes = ref([])

const formatType = (type) => {
  const types = {
    article: 'Article',
    video: 'Vidéo',
    podcast: 'Podcast',
    guide: 'Guide'
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

const naviguerCategorie = (slug) => {
  router.push(`/ressources?categorie=${slug}`)
}

const animerCompteurs = () => {
  const targets = {
    ressources: 150,
    utilisateurs: 320,
    activites: 45,
    commentaires: 890
  }
  
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
}

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Animer les compteurs
    animerCompteurs()
    
    // Charger les catégories
    categories.value = [
      {
        id: 1,
        nom: 'Communication',
        slug: 'communication',
        description: 'Améliorer ses compétences en communication verbale et non-verbale',
        icone: '💬',
        couleur: '#000091',
        nb_ressources: 42
      },
      {
        id: 2,
        nom: 'Écoute active',
        slug: 'ecoute-active',
        description: 'Techniques et pratiques pour développer son écoute',
        icone: '👂',
        couleur: '#009081',
        nb_ressources: 28
      },
      {
        id: 3,
        nom: 'Gestion des conflits',
        slug: 'gestion-conflits',
        description: 'Résoudre et prévenir les situations conflictuelles',
        icone: '⚖️',
        couleur: '#E4794A',
        nb_ressources: 35
      },
      {
        id: 4,
        nom: 'Relations familiales',
        slug: 'relations-familiales',
        description: 'Renforcer les liens familiaux et intergénérationnels',
        icone: '👨‍👩‍👧‍👦',
        couleur: '#B7A73F',
        nb_ressources: 31
      },
      {
        id: 5,
        nom: 'Relations professionnelles',
        slug: 'relations-professionnelles',
        description: 'Améliorer ses interactions en milieu professionnel',
        icone: '💼',
        couleur: '#465F9D',
        nb_ressources: 45
      },
      {
        id: 6,
        nom: 'Développement personnel',
        slug: 'developpement-personnel',
        description: 'Travail sur soi et croissance personnelle',
        icone: '🌱',
        couleur: '#009099',
        nb_ressources: 38
      }
    ]
    
    // Charger les ressources récentes
    ressourcesRecentes.value = [
      {
        id: 1,
        titre: 'Guide de la communication bienveillante',
        description: 'Découvrez les principes de base de la communication non-violente et comment les appliquer au quotidien.',
        type_ressource: 'guide',
        niveau: 'debutant',
        nb_vues: 1245,
        nb_favoris: 89,
        url_image: null
      },
      {
        id: 2,
        titre: 'Les bases de l\'écoute active',
        description: 'Apprenez à vraiment écouter l\'autre et à créer un espace de dialogue authentique.',
        type_ressource: 'article',
        niveau: 'debutant',
        nb_vues: 892,
        nb_favoris: 45,
        url_image: null
      },
      {
        id: 3,
        titre: 'Gérer les conflits familiaux',
        description: 'Stratégies avancées pour désamorcer les tensions et trouver des solutions constructives.',
        type_ressource: 'video',
        niveau: 'intermediaire',
        nb_vues: 2150,
        nb_favoris: 156,
        url_image: null
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loadingRessources.value = false
  }
})
</script>

<style scoped>
/* Styles spécifiques */
</style>