<template>
  <div class="discussion-room">
    <!-- Discussion Header -->
    <div class="fr-card fr-p-4" style="margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="flex: 1;">
          <h2 class="fr-h4" style="margin: 0 0 0.5rem 0;">{{ discussion.titre }}</h2>
          <p v-if="discussion.description" class="fr-text fr-text--sm" style="margin: 0; color: var(--text-mention-grey);">
            {{ discussion.description }}
          </p>
          <p class="fr-text fr-text--xs" style="margin: 0.5rem 0 0 0; color: var(--text-mention-grey);">
            Créé par {{ discussion.createur?.prenom }} {{ discussion.createur?.nom }}
          </p>
        </div>
        <button
          v-if="canDelete"
          @click="openDeleteModal"
          class="fr-btn fr-btn--secondary fr-btn--sm"
          style="color: var(--error);"
        >
          Supprimer
        </button>
      </div>
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="messages-container fr-card fr-p-4"
      style="height: 500px; overflow-y: auto; margin-bottom: 1rem;"
    >
      <div v-if="loading" style="display: flex; justify-content: center; padding: 2rem;">
        <div class="fr-spinner"></div>
      </div>

      <div v-else-if="messages.length === 0" style="text-align: center; padding: 3rem; color: var(--text-mention-grey);">
        <p>Aucun message pour le moment.</p>
        <p class="fr-text--sm">Soyez le premier à démarrer la conversation !</p>
      </div>

      <div v-else class="messages-list">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="{ 'message-own': message.utilisateur_id === authStore.user?.id }"
          style="margin-bottom: 1rem;"
        >
          <div style="display: flex; gap: 0.75rem;">
            <!-- Avatar -->
            <div class="avatar" style="width: 36px; height: 36px; border-radius: 50%; background: var(--blue-france-sun-113); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: white; font-weight: 600; font-size: 0.875rem;">
                {{ message.utilisateur?.prenom?.[0] }}{{ message.utilisateur?.nom?.[0] }}
              </span>
            </div>

            <!-- Message Content -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.25rem;">
                <span style="font-weight: 600; font-size: 0.875rem;">
                  {{ message.utilisateur?.prenom }} {{ message.utilisateur?.nom }}
                </span>
                <span style="font-size: 0.75rem; color: var(--text-mention-grey);">
                  {{ formatMessageTime(message.created_at) }}
                </span>
              </div>
              <div
                class="message-bubble"
                :style="{
                  background: message.utilisateur_id === authStore.user?.id ? 'var(--blue-france-sun-113)' : 'var(--grey-1000-50)',
                  color: message.utilisateur_id === authStore.user?.id ? 'white' : 'inherit',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  wordBreak: 'break-word'
                }"
              >
                {{ message.contenu }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="fr-card fr-p-3">
      <form @submit.prevent="sendMessage" style="display: flex; gap: 0.75rem;">
        <textarea
          v-model="newMessage"
          class="fr-input"
          placeholder="Écrivez votre message..."
          rows="2"
          style="flex: 1; resize: none;"
          :disabled="sending"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button
          type="submit"
          class="fr-btn"
          :disabled="!newMessage.trim() || sending"
          style="align-self: flex-end;"
        >
          {{ sending ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>
      <p class="fr-text fr-text--xs" style="margin: 0.5rem 0 0 0; color: var(--text-mention-grey);">
        Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
      </p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fr-modal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%;">
        <h3>Supprimer la discussion</h3>
        <p style="margin: 1rem 0;">Êtes-vous sûr de vouloir supprimer cette discussion ? Cette action est irréversible.</p>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
          <button @click="showDeleteModal = false" class="fr-btn fr-btn--secondary">Annuler</button>
          <button @click="confirmDelete" class="fr-btn" style="background-color: var(--error);">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import discussionService from '@/services/discussionService'
import echo from '@/services/echo'

const props = defineProps({
  ressourceId: {
    type: [Number, String],
    required: true
  },
  discussionId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['deleted'])

const authStore = useAuthStore()
const toast = useToast()
const discussion = ref({})
const messages = ref([])
const newMessage = ref('')
const loading = ref(true)
const sending = ref(false)
const messagesContainer = ref(null)

const canDelete = computed(() => {
  return discussion.value.createur_id === authStore.user?.id ||
         authStore.hasPermission?.('moderer_contenu')
})

const loadDiscussion = async () => {
  try {
    loading.value = true
    const response = await discussionService.getMessages(props.ressourceId, props.discussionId)
    discussion.value = response.data.data
    messages.value = response.data.data.messages || []
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error loading discussion:', error)
    toast.error('Erreur lors du chargement de la discussion')
  } finally {
    loading.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return

  try {
    sending.value = true
    const response = await discussionService.sendMessage(
      props.ressourceId,
      props.discussionId,
      newMessage.value.trim()
    )

    // Add message to local state
    messages.value.push(response.data.data)
    newMessage.value = ''

    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Erreur lors de l\'envoi du message')
  } finally {
    sending.value = false
  }
}

// Delete discussion
const showDeleteModal = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await discussionService.deleteDiscussion(props.ressourceId, props.discussionId)
    showDeleteModal.value = false
    toast.success('Discussion supprimée avec succès')
    emit('deleted')
  } catch (error) {
    console.error('Error deleting discussion:', error)
    toast.error('Erreur lors de la suppression de la discussion')
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'À l\'instant'
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

let channel = null

onMounted(async () => {
  await loadDiscussion()

  // Subscribe to real-time updates
  channel = echo.channel(`discussion.${props.discussionId}`)

  channel.listen('.message.sent', (data) => {
    console.log('New message received:', data)

    // Check if message already exists (to avoid duplicates)
    if (!messages.value.find(m => m.id === data.id)) {
      messages.value.push({
        id: data.id,
        contenu: data.contenu,
        utilisateur: data.utilisateur,
        utilisateur_id: data.utilisateur.id,
        created_at: data.created_at
      })

      nextTick(() => {
        scrollToBottom()
      })
    }
  })
})

onUnmounted(() => {
  if (channel) {
    echo.leaveChannel(`discussion.${props.discussionId}`)
  }
})
</script>

<style scoped>
.messages-container {
  background: #f6f6f6;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.message-own {
  justify-content: flex-end;
}
</style>
