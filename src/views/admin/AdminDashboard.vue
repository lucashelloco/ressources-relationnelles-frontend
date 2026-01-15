<template>
  <div class="fr-container fr-py-6">
    <h1 class="fr-h2">Administration</h1>

    <!-- Tabs Navigation -->
    <div class="fr-tabs">
      <ul class="fr-tabs__list" role="tablist">
        <li role="presentation">
          <button
            class="fr-tabs__tab"
            :class="{ 'fr-tabs__tab--active': activeTab === 'moderation' }"
            @click="activeTab = 'moderation'"
            role="tab"
          >
            Modération des commentaires
            <span v-if="commentairesEnAttente.length > 0" class="fr-badge fr-badge--sm" style="margin-left: 0.5rem;">
              {{ commentairesEnAttente.length }}
            </span>
          </button>
        </li>
        <li role="presentation">
          <button
            class="fr-tabs__tab"
            :class="{ 'fr-tabs__tab--active': activeTab === 'stats' }"
            @click="activeTab = 'stats'"
            role="tab"
          >
            Statistiques
          </button>
        </li>
      </ul>
    </div>

    <!-- Tab Content: Moderation -->
    <div v-show="activeTab === 'moderation'" class="fr-tabs__panel" style="margin-top: 2rem;">
      <div v-if="loading" style="display: flex; justify-content: center; padding: 3rem 0;">
        <div class="fr-spinner" style="width: 3rem; height: 3rem;"></div>
      </div>

      <div v-else-if="commentairesEnAttente.length === 0" class="fr-alert fr-alert--info">
        <p>Aucun commentaire en attente de modération</p>
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="commentaire in commentairesEnAttente" :key="commentaire.id" class="fr-card fr-p-4">
          <!-- Comment Header -->
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <div>
              <strong>{{ commentaire.auteur.prenom }} {{ commentaire.auteur.nom }}</strong>
              <span class="fr-text fr-text--sm fr-text--mention" style="margin-left: 0.5rem;">
                {{ formatDate(commentaire.created_at) }}
              </span>
            </div>
            <span class="fr-badge" style="background-color: #FEE7FC;">En attente</span>
          </div>

          <!-- Comment Content -->
          <p style="white-space: pre-wrap; margin-bottom: 1rem; padding: 1rem; background-color: #F6F6F6; border-radius: 4px;">
            {{ commentaire.contenu }}
          </p>

          <!-- Resource Info -->
          <div style="margin-bottom: 1rem; padding: 0.75rem; background-color: #E3E3FD; border-radius: 4px;">
            <p class="fr-text--sm" style="margin: 0;">
              <strong>Ressource:</strong>
              <router-link :to="`/ressources/${commentaire.ressource.id}`" style="margin-left: 0.5rem;">
                {{ commentaire.ressource.titre }}
              </router-link>
            </p>
            <p v-if="commentaire.parent_id" class="fr-text--sm" style="margin: 0.5rem 0 0 0;">
              <strong>Réponse à un commentaire</strong>
            </p>
          </div>

          <!-- Moderation Actions -->
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button
              @click="ouvrirModalRejet(commentaire)"
              class="fr-btn fr-btn--secondary"
            >
              Rejeter
            </button>
            <button
              @click="approuverCommentaire(commentaire.id)"
              class="fr-btn"
            >
              Approuver
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Statistics -->
    <div v-show="activeTab === 'stats'" class="fr-tabs__panel" style="margin-top: 2rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
        <div class="fr-card fr-p-4">
          <h3 class="fr-h6">Ressources</h3>
          <p style="font-size: 2rem; font-weight: bold; color: var(--blue-france); margin: 0;">
            {{ stats.ressources }}
          </p>
        </div>
        <div class="fr-card fr-p-4">
          <h3 class="fr-h6">Utilisateurs</h3>
          <p style="font-size: 2rem; font-weight: bold; color: var(--green-tilleul-verveine); margin: 0;">
            {{ stats.utilisateurs }}
          </p>
        </div>
        <div class="fr-card fr-p-4">
          <h3 class="fr-h6">Activités</h3>
          <p style="font-size: 2rem; font-weight: bold; color: var(--purple-glycine); margin: 0;">
            {{ stats.activites }}
          </p>
        </div>
        <div class="fr-card fr-p-4">
          <h3 class="fr-h6">Commentaires</h3>
          <p style="font-size: 2rem; font-weight: bold; color: var(--orange-terre-battue); margin: 0;">
            {{ stats.commentaires }}
          </p>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="commentaireARejeter" class="fr-modal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%;">
        <h3>Rejeter le commentaire</h3>
        <p style="margin: 1rem 0;">Veuillez indiquer la raison du rejet :</p>
        <textarea
          v-model="raisonRejet"
          class="fr-input"
          rows="4"
          placeholder="Ex: Contenu inapproprié, spam, violation des règles..."
          style="width: 100%; margin-bottom: 1rem;"
        ></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
          <button @click="fermerModalRejet" class="fr-btn fr-btn--secondary">Annuler</button>
          <button
            @click="rejeterCommentaire"
            class="fr-btn"
            :disabled="!raisonRejet.trim()"
          >
            Confirmer le rejet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import statsService from '@/services/statsService'

const activeTab = ref('moderation')
const loading = ref(true)
const commentairesEnAttente = ref([])
const stats = ref({
  ressources: 0,
  utilisateurs: 0,
  activites: 0,
  commentaires: 0
})

// Reject modal
const commentaireARejeter = ref(null)
const raisonRejet = ref('')

const chargerCommentairesEnAttente = async () => {
  loading.value = true
  try {
    const response = await api.get('/commentaires/en-attente')
    commentairesEnAttente.value = response.data.data
  } catch (error) {
    console.error('Error loading pending comments:', error)
    alert('Erreur lors du chargement des commentaires')
  } finally {
    loading.value = false
  }
}

const chargerStats = async () => {
  try {
    const response = await statsService.getStats()
    stats.value = response.data
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const approuverCommentaire = async (commentaireId) => {
  if (!confirm('Approuver ce commentaire ?')) return

  try {
    await api.post(`/commentaires/${commentaireId}/approuver`)
    alert('Commentaire approuvé avec succès')
    await chargerCommentairesEnAttente()
  } catch (error) {
    console.error('Error approving comment:', error)
    alert('Erreur lors de l\'approbation du commentaire')
  }
}

const ouvrirModalRejet = (commentaire) => {
  commentaireARejeter.value = commentaire
  raisonRejet.value = ''
}

const fermerModalRejet = () => {
  commentaireARejeter.value = null
  raisonRejet.value = ''
}

const rejeterCommentaire = async () => {
  if (!raisonRejet.value.trim()) return

  try {
    await api.post(`/commentaires/${commentaireARejeter.value.id}/rejeter`, {
      raison: raisonRejet.value
    })
    alert('Commentaire rejeté avec succès')
    fermerModalRejet()
    await chargerCommentairesEnAttente()
  } catch (error) {
    console.error('Error rejecting comment:', error)
    alert('Erreur lors du rejet du commentaire')
  }
}

const formatDate = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diffInSeconds = Math.floor((now - commentDate) / 1000)

  if (diffInSeconds < 60) return 'À l\'instant'
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`

  return commentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  await Promise.all([
    chargerCommentairesEnAttente(),
    chargerStats()
  ])
})
</script>
