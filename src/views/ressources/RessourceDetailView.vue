<template>
  <div class="fr-container fr-py-6">
    <div v-if="loading" style="display: flex; justify-content: center; padding: 3rem 0;">
      <div class="fr-spinner" style="width: 3rem; height: 3rem;"></div>
    </div>

    <div v-else-if="error" class="fr-alert fr-alert--error">
      <h3 class="fr-alert__title">Erreur</h3>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="ressource" style="max-width: 56rem; margin: 0 auto;">
      <!-- Header -->
      <div style="margin-bottom: 2rem;">
        <h1 class="fr-h2" style="margin-bottom: 1rem;">{{ ressource.titre }}</h1>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <span v-for="categorie in ressource.categories" :key="categorie.id" class="fr-badge" :style="`background-color: ${categorie.couleur}20; color: ${categorie.couleur};`">
            {{ categorie.nom }}
          </span>
        </div>

        <div style="display: flex; gap: 1.5rem; color: var(--text-mention-grey); font-size: 0.875rem; margin-bottom: 1rem;">
          <span>Par {{ ressource.auteur.prenom }} {{ ressource.auteur.nom }}</span>
          <span>{{ ressource.nb_vues }} vues</span>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span v-for="tag in ressource.tags" :key="tag.id" class="fr-tag">
            {{ tag.nom }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div class="fr-card fr-p-4" style="margin-bottom: 2rem;">
        <p style="white-space: pre-wrap;">{{ ressource.description }}</p>
      </div>

      <!-- Content -->
      <div v-if="ressource.contenu" class="fr-card fr-p-4" style="margin-bottom: 3rem;">
        <div v-html="ressource.contenu" style="white-space: pre-wrap;"></div>
      </div>

      <!-- Tabs for Discussions and Comments -->
      <div style="margin-top: 3rem;">
        <div class="fr-tabs">
          <ul class="fr-tabs__list" role="tablist">
            <li role="presentation">
              <button
                class="fr-tabs__tab"
                :class="{ 'fr-tabs__tab--active': activeTab === 'discussions' }"
                @click="activeTab = 'discussions'"
                role="tab"
              >
                Discussions
              </button>
            </li>
            <li role="presentation">
              <button
                class="fr-tabs__tab"
                :class="{ 'fr-tabs__tab--active': activeTab === 'commentaires' }"
                @click="activeTab = 'commentaires'"
                role="tab"
              >
                Commentaires ({{ commentaires.length }})
              </button>
            </li>
          </ul>
        </div>

        <!-- Discussions Tab -->
        <div v-show="activeTab === 'discussions'" class="fr-tabs__panel" style="margin-top: 2rem;">
          <div v-if="!selectedDiscussionId">
            <DiscussionList
              :ressource-id="ressource.id"
              @discussion-selected="handleDiscussionSelected"
            />
          </div>
          <div v-else>
            <button
              @click="selectedDiscussionId = null"
              class="fr-btn fr-btn--secondary fr-btn--sm"
              style="margin-bottom: 1rem;"
            >
              ← Retour aux discussions
            </button>
            <DiscussionRoom
              :ressource-id="ressource.id"
              :discussion-id="selectedDiscussionId"
              @deleted="handleDiscussionDeleted"
            />
          </div>
        </div>

        <!-- Comments Tab -->
        <div v-show="activeTab === 'commentaires'" class="fr-tabs__panel" style="margin-top: 2rem;">
          <h2 class="fr-h4" style="margin-bottom: 1.5rem;">
            Commentaires ({{ commentaires.length }})
          </h2>

        <!-- Comment Form -->
        <div v-if="authStore.isAuthenticated" class="fr-card fr-p-4" style="margin-bottom: 2rem;">
          <textarea
            v-model="nouveauCommentaire"
            class="fr-input"
            placeholder="Ajouter un commentaire..."
            rows="3"
            style="width: 100%; margin-bottom: 1rem;"
          ></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button
              @click="annulerCommentaire"
              class="fr-btn fr-btn--secondary"
              :disabled="!nouveauCommentaire.trim()"
            >
              Annuler
            </button>
            <button
              @click="ajouterCommentaire"
              class="fr-btn"
              :disabled="!nouveauCommentaire.trim() || nouveauCommentaire.length < 10"
            >
              Publier
            </button>
          </div>
          <p v-if="nouveauCommentaire.length > 0 && nouveauCommentaire.length < 10" class="fr-error-text" style="margin-top: 0.5rem;">
            Minimum 10 caractères requis
          </p>
        </div>

        <div v-else class="fr-card fr-p-4" style="margin-bottom: 2rem; text-align: center;">
          <p class="fr-text--sm">
            <router-link to="/login">Connectez-vous</router-link> pour publier un commentaire
          </p>
        </div>

        <!-- Comment Form for Reply -->
        <div v-if="commentaireEnReponse" class="fr-card fr-p-4" style="margin-bottom: 2rem; background-color: #F6F6F6;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <strong>Répondre à {{ commentaireEnReponse.auteur.prenom }} {{ commentaireEnReponse.auteur.nom }}</strong>
            <button @click="annulerReponse" class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline">✕</button>
          </div>
          <textarea
            v-model="reponseCommentaire"
            class="fr-input"
            placeholder="Votre réponse..."
            rows="3"
            style="width: 100%; margin-bottom: 1rem;"
          ></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button
              @click="annulerReponse"
              class="fr-btn fr-btn--secondary"
            >
              Annuler
            </button>
            <button
              @click="envoyerReponse"
              class="fr-btn"
              :disabled="!reponseCommentaire.trim() || reponseCommentaire.length < 10"
            >
              Répondre
            </button>
          </div>
        </div>

        <!-- Comments List -->
        <div v-if="commentaires.length > 0" style="display: flex; flex-direction: column; gap: 1rem;">
          <CommentaireItem
            v-for="commentaire in commentaires"
            :key="commentaire.id"
            :commentaire="commentaire"
            :user-id="authStore.user?.id"
            @modifier="ouvrirModification"
            @supprimer="supprimerCommentaire"
            @repondre="repondreCommentaire"
          />
        </div>

        <div v-else style="text-align: center; padding: 2rem; color: var(--text-mention-grey);">
          <p>Aucun commentaire pour le moment. Soyez le premier à commenter!</p>
        </div>
      </div>

      <!-- Edit Comment Modal -->
      <div v-if="commentaireEnModification" class="fr-modal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%;">
          <h3>Modifier le commentaire</h3>
          <textarea
            v-model="commentaireModifie"
            class="fr-input"
            rows="4"
            style="width: 100%; margin: 1rem 0;"
          ></textarea>
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button @click="annulerModification" class="fr-btn fr-btn--secondary">Annuler</button>
            <button @click="sauvegarderModification" class="fr-btn" :disabled="commentaireModifie.length < 10">Sauvegarder</button>
          </div>
        </div>
      </div>

      <!-- Delete Comment Modal -->
      <div v-if="showDeleteModal" class="fr-modal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%;">
          <h3>Supprimer le commentaire</h3>
          <p style="margin: 1rem 0;">Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.</p>
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
            <button @click="showDeleteModal = false; commentaireASupprimer = null" class="fr-btn fr-btn--secondary">Annuler</button>
            <button @click="confirmerSuppression" class="fr-btn" style="background-color: var(--error);">
              Supprimer
            </button>
          </div>
        </div>
      </div>
      <!-- End Comments Tab -->
      </div>
      <!-- End Tabs -->
    </div>

    <div v-else class="fr-alert fr-alert--warning">
      <p>Ressource non trouvée</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRessourceStore } from '@/stores/ressourceStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import commentaireService from '@/services/commentaireService'
import CommentaireItem from '@/components/commentaires/CommentaireItem.vue'
import DiscussionList from '@/components/discussions/DiscussionList.vue'
import DiscussionRoom from '@/components/discussions/DiscussionRoom.vue'

const route = useRoute()
const ressourceStore = useRessourceStore()
const authStore = useAuthStore()
const toast = useToast()
const loading = ref(true)
const ressource = ref(null)
const commentaires = ref([])
const error = ref(null)

// Tabs
const activeTab = ref('discussions')
const selectedDiscussionId = ref(null)

// Check if we should open a specific discussion from URL query param
if (route.query.discussion) {
  selectedDiscussionId.value = parseInt(route.query.discussion)
  activeTab.value = 'discussions'
}

// Comment form
const nouveauCommentaire = ref('')
const reponseCommentaire = ref('')
const commentaireEnReponse = ref(null)

// Edit comment
const commentaireEnModification = ref(null)
const commentaireModifie = ref('')

// Delete comment
const commentaireASupprimer = ref(null)
const showDeleteModal = ref(false)

// Discussion handlers
const handleDiscussionSelected = (discussionId) => {
  selectedDiscussionId.value = discussionId
}

const handleDiscussionDeleted = () => {
  selectedDiscussionId.value = null
}

const chargerCommentaires = async () => {
  try {
    const response = await commentaireService.getCommentaires(route.params.id)
    commentaires.value = response.data || response
  } catch (err) {
    console.error('Error loading comments:', err)
  }
}

const ajouterCommentaire = async () => {
  if (!nouveauCommentaire.value.trim() || nouveauCommentaire.value.length < 10) return

  try {
    await commentaireService.creerCommentaire(route.params.id, {
      contenu: nouveauCommentaire.value
    })
    nouveauCommentaire.value = ''
    toast.success('Commentaire envoyé. Il sera visible après modération.')
    await chargerCommentaires()
  } catch (err) {
    console.error('Error creating comment:', err)
    toast.error('Erreur lors de la publication du commentaire')
  }
}

const annulerCommentaire = () => {
  nouveauCommentaire.value = ''
}

const repondreCommentaire = (commentaire) => {
  commentaireEnReponse.value = commentaire
  reponseCommentaire.value = ''
}

const annulerReponse = () => {
  commentaireEnReponse.value = null
  reponseCommentaire.value = ''
}

const envoyerReponse = async () => {
  if (!reponseCommentaire.value.trim() || reponseCommentaire.value.length < 10) return

  try {
    await commentaireService.creerCommentaire(route.params.id, {
      contenu: reponseCommentaire.value,
      parent_id: commentaireEnReponse.value.id
    })
    annulerReponse()
    toast.success('Réponse envoyée. Elle sera visible après modération.')
    await chargerCommentaires()
  } catch (err) {
    console.error('Error creating reply:', err)
    toast.error('Erreur lors de la publication de la réponse')
  }
}

const ouvrirModification = (commentaire) => {
  commentaireEnModification.value = commentaire
  commentaireModifie.value = commentaire.contenu
}

const annulerModification = () => {
  commentaireEnModification.value = null
  commentaireModifie.value = ''
}

const sauvegarderModification = async () => {
  if (commentaireModifie.value.length < 10) return

  try {
    await commentaireService.modifierCommentaire(
      route.params.id,
      commentaireEnModification.value.id,
      { contenu: commentaireModifie.value }
    )
    annulerModification()
    toast.success('Commentaire modifié avec succès')
    await chargerCommentaires()
  } catch (err) {
    console.error('Error updating comment:', err)
    toast.error('Erreur lors de la modification du commentaire')
  }
}

const supprimerCommentaire = (commentaireId) => {
  commentaireASupprimer.value = commentaireId
  showDeleteModal.value = true
}

const confirmerSuppression = async () => {
  if (!commentaireASupprimer.value) return

  try {
    await commentaireService.supprimerCommentaire(route.params.id, commentaireASupprimer.value)
    toast.success('Commentaire supprimé avec succès')
    showDeleteModal.value = false
    commentaireASupprimer.value = null
    await chargerCommentaires()
  } catch (err) {
    console.error('Error deleting comment:', err)
    toast.error('Erreur lors de la suppression du commentaire')
  }
}

onMounted(async () => {
  try {
    ressource.value = await ressourceStore.fetchRessourceById(route.params.id)
    await chargerCommentaires()
  } catch (err) {
    console.error('Error loading ressource:', err)
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
})
</script>
