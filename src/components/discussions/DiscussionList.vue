<template>
  <div class="discussion-list">
    <!-- Header with Create Button -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 class="fr-h5" style="margin: 0;">Discussions</h3>
      <button
        v-if="authStore.isAuthenticated"
        @click="showCreateModal = true"
        class="fr-btn fr-btn--sm"
      >
        Nouvelle discussion
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" style="display: flex; justify-content: center; padding: 2rem;">
      <div class="fr-spinner"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="discussions.length === 0" class="fr-card fr-p-4" style="text-align: center;">
      <p style="color: var(--text-mention-grey); margin: 0;">
        Aucune discussion pour cette ressource.
      </p>
      <p v-if="authStore.isAuthenticated" class="fr-text--sm" style="color: var(--text-mention-grey); margin: 0.5rem 0 0 0;">
        Créez-en une pour démarrer la conversation !
      </p>
    </div>

    <!-- Discussions List -->
    <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
      <div
        v-for="discussion in discussions"
        :key="discussion.id"
        class="fr-card fr-p-3"
        style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
        @click="selectDiscussion(discussion.id)"
        @mouseenter="$event.currentTarget.style.transform = 'translateY(-2px)'"
        @mouseleave="$event.currentTarget.style.transform = 'translateY(0)'"
      >
        <div style="display: flex; justify-content: space-between; align-items: start; gap: 1rem;">
          <div style="flex: 1; min-width: 0;">
            <h4 class="fr-h6" style="margin: 0 0 0.25rem 0;">{{ discussion.titre }}</h4>
            <p v-if="discussion.description" class="fr-text fr-text--sm" style="margin: 0 0 0.5rem 0; color: var(--text-mention-grey); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{ discussion.description }}
            </p>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <span class="fr-badge fr-badge--sm">
                {{ discussion.messages_count || 0 }} message{{ discussion.messages_count > 1 ? 's' : '' }}
              </span>
              <span class="fr-text fr-text--xs" style="color: var(--text-mention-grey);">
                Par {{ discussion.createur?.prenom }} {{ discussion.createur?.nom }}
              </span>
              <span v-if="discussion.derniere_activite" class="fr-text fr-text--xs" style="color: var(--text-mention-grey);">
                {{ formatLastActivity(discussion.derniere_activite) }}
              </span>
            </div>
          </div>
          <svg class="w-5 h-5" style="flex-shrink: 0; width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Create Discussion Modal -->
    <div v-if="showCreateModal" class="fr-modal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px; max-width: 600px; width: 90%;">
        <h3 class="fr-h5" style="margin: 0 0 1.5rem 0;">Créer une nouvelle discussion</h3>

        <div class="fr-input-group" style="margin-bottom: 1rem;">
          <label class="fr-label" for="discussion-titre">
            Titre <span style="color: var(--error);">*</span>
          </label>
          <input
            id="discussion-titre"
            v-model="newDiscussion.titre"
            type="text"
            class="fr-input"
            placeholder="Ex: Question sur la communication non-violente"
            maxlength="255"
          />
        </div>

        <div class="fr-input-group" style="margin-bottom: 1.5rem;">
          <label class="fr-label" for="discussion-description">
            Description (optionnel)
          </label>
          <textarea
            id="discussion-description"
            v-model="newDiscussion.description"
            class="fr-input"
            rows="3"
            placeholder="Décrivez brièvement le sujet de discussion..."
          ></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button @click="closeCreateModal" class="fr-btn fr-btn--secondary">
            Annuler
          </button>
          <button
            @click="createDiscussion"
            class="fr-btn"
            :disabled="!newDiscussion.titre.trim() || creating"
          >
            {{ creating ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import discussionService from '@/services/discussionService'

const props = defineProps({
  ressourceId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['discussion-selected'])

const authStore = useAuthStore()
const toast = useToast()
const discussions = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const creating = ref(false)
const newDiscussion = ref({
  titre: '',
  description: ''
})

const loadDiscussions = async () => {
  try {
    loading.value = true
    const response = await discussionService.getDiscussions(props.ressourceId)
    discussions.value = response.data.data
  } catch (error) {
    console.error('Error loading discussions:', error)
  } finally {
    loading.value = false
  }
}

const createDiscussion = async () => {
  if (!newDiscussion.value.titre.trim() || creating.value) return

  try {
    creating.value = true
    const response = await discussionService.createDiscussion(props.ressourceId, {
      titre: newDiscussion.value.titre.trim(),
      description: newDiscussion.value.description.trim() || null
    })

    discussions.value.unshift(response.data.data)
    closeCreateModal()
    toast.success('Discussion créée avec succès')

    // Auto-select the newly created discussion
    emit('discussion-selected', response.data.data.id)
  } catch (error) {
    console.error('Error creating discussion:', error)
    toast.error('Erreur lors de la création de la discussion')
  } finally {
    creating.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newDiscussion.value = {
    titre: '',
    description: ''
  }
}

const selectDiscussion = (discussionId) => {
  emit('discussion-selected', discussionId)
}

const formatLastActivity = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Actif à l\'instant'
  if (diffInSeconds < 3600) return `Actif il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Actif il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Actif il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`

  return `Actif le ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
}

onMounted(() => {
  loadDiscussions()
})

// Expose reload method for parent components
defineExpose({
  loadDiscussions
})
</script>

<style scoped>
.fr-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
