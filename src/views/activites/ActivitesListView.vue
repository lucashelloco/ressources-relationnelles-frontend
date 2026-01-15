<template>
  <div class="fr-container fr-py-6">
    <!-- En-tête -->
    <div class="fr-grid-row fr-mb-6">
      <div class="fr-col-12">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 class="fr-h1" style="margin: 0 0 0.5rem 0;">Activités et événements</h1>
            <p class="fr-text fr-text--lg fr-text--mention" style="margin: 0;">
              Participez aux ateliers, discussions et événements de la communauté
            </p>
          </div>
          <router-link to="/activites/new" class="fr-btn fr-btn--icon-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Créer une activité
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
              <label class="fr-label" for="type">Type d'activité</label>
              <select id="type" v-model="filters.type" class="fr-select">
                <option value="">Tous les types</option>
                <option value="discussion">Discussion</option>
                <option value="evenement">Événement</option>
                <option value="atelier">Atelier</option>
                <option value="groupe_echange">Groupe d'échange</option>
                <option value="conference">Conférence</option>
              </select>
            </div>
          </div>
          
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <div class="fr-input-group">
              <label class="fr-label" for="statut">Statut</label>
              <select id="statut" v-model="filters.statut" class="fr-select">
                <option value="">Tous</option>
                <option value="a_venir">À venir</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets -->
    <div style="border-bottom: 2px solid var(--border-default-grey); margin-bottom: 2rem;">
      <nav role="navigation" aria-label="Navigation par onglets">
        <ul style="display: flex; list-style: none; padding: 0; margin: 0; gap: 1rem; flex-wrap: wrap;">
          <li>
            <button
              @click="ongletActif = 'tous'"
              :class="{ 'active': ongletActif === 'tous' }"
              class="tab-button"
              :aria-current="ongletActif === 'tous' ? 'page' : undefined"
            >
              Toutes les activités
            </button>
          </li>
          <li>
            <button
              @click="ongletActif = 'mes_activites'"
              :class="{ 'active': ongletActif === 'mes_activites' }"
              class="tab-button"
            >
              Mes activités
            </button>
          </li>
          <li>
            <button
              @click="ongletActif = 'inscriptions'"
              :class="{ 'active': ongletActif === 'inscriptions' }"
              class="tab-button"
            >
              Mes inscriptions
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" style="display: flex; justify-content: center; padding: 3rem 0;">
      <div class="fr-spinner"></div>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="activitesFiltrees.length === 0" style="text-align: center; padding: 3rem 0;">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--grey-625); margin-bottom: 1rem;">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <p class="fr-text fr-text--lg fr-text--mention">Aucune activité trouvée</p>
    </div>

    <!-- Liste des activités -->
    <div v-else class="fr-grid-row" style="row-gap: 1.5rem;">
      <div
        v-for="activite in activitesFiltrees"
        :key="activite.id"
        class="fr-col-12 fr-col-lg-6"
      >
        <article class="fr-card" style="cursor: pointer; height: 100%;" @click="$router.push(`/activites/${activite.id}`)">
          <div class="fr-card__body">
            <!-- En-tête avec type et statut -->
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="fr-badge" :class="getBadgeTypeClass(activite.type)">
                  {{ formatType(activite.type) }}
                </span>
                <span v-if="activite.en_ligne" class="fr-badge" style="background-color: #E3E8F7; color: var(--blue-ecume);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.25rem;">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                  En ligne
                </span>
              </div>
              <span class="fr-badge" :class="getBadgeStatutClass(activite.statut)">
                {{ formatStatut(activite.statut) }}
              </span>
            </div>

            <!-- Titre et description -->
            <h2 class="fr-card__title">
              {{ activite.titre }}
            </h2>
            
            <p class="fr-card__desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ activite.description }}
            </p>

            <!-- Métadonnées -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-default-grey);">
              <!-- Date et heure -->
              <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-mention-grey);">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="fr-text fr-text--sm">
                  {{ formatDate(activite.date_debut) }}
                </span>
              </div>

              <!-- Lieu ou lien -->
              <div v-if="!activite.en_ligne && activite.lieu" style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-mention-grey);">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span class="fr-text fr-text--sm">
                  {{ activite.lieu }}
                </span>
              </div>

              <!-- Participants -->
              <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-mention-grey);">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span class="fr-text fr-text--sm">
                  {{ activite.nb_participants_actuels }} / {{ activite.nb_participants_max || '∞' }} participants
                </span>
              </div>

              <!-- Organisateur -->
              <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-mention-grey);">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="fr-text fr-text--sm">
                  Organisé par {{ activite.organisateur }}
                </span>
              </div>
            </div>

            <!-- Action d'inscription -->
            <div style="margin-top: 1rem;" @click.stop>
              <button
                v-if="!activite.inscrit"
                @click="inscrire(activite.id)"
                class="fr-btn fr-btn--sm"
                style="width: 100%;"
                :disabled="activite.nb_participants_actuels >= activite.nb_participants_max"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem;">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                {{ activite.nb_participants_actuels >= activite.nb_participants_max ? 'Complet' : 'S\'inscrire' }}
              </button>
              <button
                v-else
                @click="desinscrire(activite.id)"
                class="fr-btn fr-btn--secondary fr-btn--sm"
                style="width: 100%;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.375rem;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Inscrit
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Toast de succès -->
    <div v-if="showToast" class="fr-alert fr-alert--success" style="position: fixed; bottom: 2rem; right: 2rem; max-width: 20rem; z-index: 1000; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatTypeActivite, formatStatutActivite } from '@/utils/formatters'

const loading = ref(true)
const activites = ref([])
const ongletActif = ref('tous')
const showToast = ref(false)
const toastMessage = ref('')

const filters = ref({
  search: '',
  type: '',
  statut: ''
})

const activitesFiltrees = computed(() => {
  let resultat = activites.value

  // Filtrer par onglet
  if (ongletActif.value === 'mes_activites') {
    resultat = resultat.filter(a => a.organisateur === 'Vous')
  } else if (ongletActif.value === 'inscriptions') {
    resultat = resultat.filter(a => a.inscrit)
  }

  // Appliquer les filtres
  return resultat.filter(activite => {
    const matchSearch = !filters.value.search ||
      activite.titre.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      activite.description?.toLowerCase().includes(filters.value.search.toLowerCase())

    const matchType = !filters.value.type || activite.type === filters.value.type
    const matchStatut = !filters.value.statut || activite.statut === filters.value.statut

    return matchSearch && matchType && matchStatut
  })
})

const formatType = formatTypeActivite
const formatStatut = formatStatutActivite

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return date.toLocaleDateString('fr-FR', options)
}

const getBadgeTypeClass = (type) => {
  const classes = {
    discussion: 'fr-badge--info',
    evenement: 'fr-badge--success',
    atelier: 'fr-badge--warning',
    groupe_echange: 'fr-badge--info',
    conference: 'fr-badge--error'
  }
  return classes[type] || 'fr-badge--info'
}

const getBadgeStatutClass = (statut) => {
  const classes = {
    a_venir: 'fr-badge--success',
    en_cours: 'fr-badge--info',
    termine: 'fr-badge--warning',
    annule: 'fr-badge--error'
  }
  return classes[statut] || 'fr-badge--info'
}

const inscrire = (id) => {
  const activite = activites.value.find(a => a.id === id)
  if (activite) {
    activite.inscrit = true
    activite.nb_participants_actuels++
    afficherToast('Inscription confirmée !')
  }
}

const desinscrire = (id) => {
  const activite = activites.value.find(a => a.id === id)
  if (activite) {
    activite.inscrit = false
    activite.nb_participants_actuels--
    afficherToast('Désinscription effectuée')
  }
}

const afficherToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    activites.value = [
      {
        id: 1,
        titre: 'Atelier Communication Non-Violente',
        description: 'Découvrez et pratiquez les bases de la CNV dans un cadre bienveillant et convivial.',
        type: 'atelier',
        statut: 'a_venir',
        date_debut: '2026-02-15T14:00:00',
        en_ligne: false,
        lieu: 'Centre communautaire, Rouen',
        nb_participants_actuels: 8,
        nb_participants_max: 12,
        organisateur: 'Sophie Martin',
        inscrit: false
      },
      {
        id: 2,
        titre: 'Groupe d\'échange - Relations familiales',
        description: 'Partagez vos expériences et trouvez du soutien dans un groupe bienveillant.',
        type: 'groupe_echange',
        statut: 'en_cours',
        date_debut: '2026-01-20T18:30:00',
        en_ligne: true,
        lieu: null,
        nb_participants_actuels: 6,
        nb_participants_max: 10,
        organisateur: 'Vous',
        inscrit: true
      },
      {
        id: 3,
        titre: 'Conférence: Les clés de l\'écoute active',
        description: 'Intervention d\'un expert en communication pour découvrir les fondamentaux de l\'écoute active.',
        type: 'conference',
        statut: 'a_venir',
        date_debut: '2026-03-10T19:00:00',
        en_ligne: true,
        lieu: null,
        nb_participants_actuels: 45,
        nb_participants_max: 100,
        organisateur: 'Association Dialogue+',
        inscrit: true
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des activités:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tab-button {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-mention-grey);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: var(--blue-france);
  background-color: var(--background-alt-grey);
}

.tab-button.active {
  color: var(--blue-france);
  border-bottom-color: var(--blue-france);
}
</style>