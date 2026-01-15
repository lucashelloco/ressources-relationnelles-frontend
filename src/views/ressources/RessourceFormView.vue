<template>
  <div class="fr-container fr-py-6">
    <div style="max-width: 56rem; margin: 0 auto;">
      <!-- En-tête -->
      <div class="fr-mb-6">
        <nav role="navigation" aria-label="Fil d'Ariane" class="fr-mb-4">
          <ol style="display: flex; flex-wrap: wrap; list-style: none; padding: 0; margin: 0; gap: 0.5rem; font-size: 0.875rem; color: var(--text-mention-grey);">
            <li>
              <router-link to="/" style="color: var(--blue-france); text-decoration: none;">Accueil</router-link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <router-link to="/ressources" style="color: var(--blue-france); text-decoration: none;">Ressources</router-link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{{ isEditing ? 'Modifier' : 'Nouvelle ressource' }}</li>
          </ol>
        </nav>
        
        <h1 class="fr-h1">
          {{ isEditing ? 'Modifier la ressource' : 'Créer une nouvelle ressource' }}
        </h1>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="fr-card">
        <div class="fr-card__body" style="padding: var(--space-6);">
          <!-- Alerte d'erreur -->
          <div v-if="errors.length > 0" class="fr-alert fr-alert--error fr-mb-4">
            <p class="fr-text" style="font-weight: 500; margin-bottom: 0.5rem;">Veuillez corriger les erreurs suivantes :</p>
            <ul style="margin: 0; padding-left: 1.5rem;">
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </div>

          <!-- Titre -->
          <div class="fr-input-group fr-mb-4">
            <label class="fr-label" for="titre">
              Titre <span style="color: var(--red-marianne);">*</span>
            </label>
            <input
              id="titre"
              v-model="form.titre"
              type="text"
              class="fr-input"
              :class="{ 'fr-input--error': fieldErrors.titre }"
              required
              placeholder="Ex: Guide de la communication bienveillante"
            />
            <p v-if="fieldErrors.titre" class="fr-text fr-text--sm" style="color: var(--red-marianne); margin-top: 0.25rem;">
              {{ fieldErrors.titre }}
            </p>
          </div>

          <!-- Description -->
          <div class="fr-input-group fr-mb-4">
            <label class="fr-label" for="description">
              Description <span style="color: var(--red-marianne);">*</span>
            </label>
            <textarea
              id="description"
              v-model="form.description"
              class="fr-input"
              :class="{ 'fr-input--error': fieldErrors.description }"
              rows="3"
              required
              placeholder="Résumé de la ressource en quelques phrases..."
              style="resize: vertical;"
            ></textarea>
            <p v-if="fieldErrors.description" class="fr-text fr-text--sm" style="color: var(--red-marianne); margin-top: 0.25rem;">
              {{ fieldErrors.description }}
            </p>
          </div>

          <!-- Type et Niveau -->
          <div class="fr-grid-row fr-mb-4" style="row-gap: 1rem;">
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="type">
                  Type de ressource <span style="color: var(--red-marianne);">*</span>
                </label>
                <select
                  id="type"
                  v-model="form.type_ressource"
                  class="fr-select"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option v-for="type in typesRessource" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="niveau">
                  Niveau <span style="color: var(--red-marianne);">*</span>
                </label>
                <select
                  id="niveau"
                  v-model="form.niveau"
                  class="fr-select"
                  required
                >
                  <option value="">Sélectionnez un niveau</option>
                  <option v-for="niveau in niveaux" :key="niveau.value" :value="niveau.value">
                    {{ niveau.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Type de relation et Niveau de partage -->
          <div class="fr-grid-row fr-mb-4" style="row-gap: 1rem;">
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="type-relation">
                  Type de relation
                </label>
                <select
                  id="type-relation"
                  v-model="form.type_relation"
                  class="fr-select"
                >
                  <option value="">Sélectionnez un type (optionnel)</option>
                  <option v-for="type in typesRelation" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="niveau-partage">
                  Niveau de partage <span style="color: var(--red-marianne);">*</span>
                </label>
                <select
                  id="niveau-partage"
                  v-model="form.niveau_partage"
                  class="fr-select"
                  required
                >
                  <option v-for="niveau in niveauxPartage" :key="niveau.value" :value="niveau.value">
                    {{ niveau.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Durée de lecture -->
          <div class="fr-input-group fr-mb-4">
            <label class="fr-label" for="duree">
              Durée de lecture estimée (en minutes)
            </label>
            <input
              id="duree"
              v-model.number="form.duree_lecture"
              type="number"
              class="fr-input"
              min="1"
              max="999"
              placeholder="Ex: 15"
              style="max-width: 10rem;"
            />
          </div>

          <!-- Contenu -->
          <div class="fr-input-group fr-mb-4">
            <label class="fr-label" for="contenu">
              Contenu de la ressource
            </label>
            <textarea
              id="contenu"
              v-model="form.contenu"
              class="fr-input"
              rows="12"
              placeholder="Rédigez le contenu complet de votre ressource..."
              style="resize: vertical; font-family: inherit;"
            ></textarea>
            <p class="fr-text fr-text--sm fr-text--mention" style="margin-top: 0.25rem;">
              Vous pouvez utiliser du HTML pour mettre en forme votre contenu.
            </p>
          </div>

          <!-- URLs -->
          <div class="fr-grid-row fr-mb-4" style="row-gap: 1rem;">
            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="url-externe">
                  URL externe
                </label>
                <input
                  id="url-externe"
                  v-model="form.url_externe"
                  type="url"
                  class="fr-input"
                  placeholder="https://exemple.fr/ressource"
                />
                <p class="fr-text fr-text--sm fr-text--mention" style="margin-top: 0.25rem;">
                  Lien vers la ressource originale
                </p>
              </div>
            </div>

            <div class="fr-col-12 fr-col-md-6">
              <div class="fr-input-group">
                <label class="fr-label" for="url-image">
                  URL de l'image de couverture
                </label>
                <input
                  id="url-image"
                  v-model="form.url_image"
                  type="url"
                  class="fr-input"
                  placeholder="https://exemple.fr/image.jpg"
                />
                <p class="fr-text fr-text--sm fr-text--mention" style="margin-top: 0.25rem;">
                  Image illustrant la ressource
                </p>
              </div>
            </div>
          </div>

          <!-- Aperçu de l'image -->
          <div v-if="form.url_image" class="fr-mb-4">
            <p class="fr-text" style="font-weight: 500; margin-bottom: 0.5rem;">Aperçu de l'image :</p>
            <div style="max-width: 24rem; border: 1px solid var(--border-default-grey); border-radius: 0.5rem; overflow: hidden;">
              <img :src="form.url_image" alt="Aperçu" style="width: 100%; height: auto; display: block;" @error="form.url_image = ''" />
            </div>
          </div>

          <!-- Mots-clés / Tags -->
          <div class="fr-input-group fr-mb-6">
            <label class="fr-label" for="tags">
              Mots-clés (séparés par des virgules)
            </label>
            <input
              id="tags"
              v-model="form.tags"
              type="text"
              class="fr-input"
              placeholder="communication, famille, bien-être, écoute"
            />
            <p class="fr-text fr-text--sm fr-text--mention" style="margin-top: 0.25rem;">
              Ajoutez des mots-clés pour faciliter la recherche de votre ressource
            </p>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 1px solid var(--border-default-grey);">
            <button
              type="submit"
              class="fr-btn"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Enregistrer les modifications' : 'Créer la ressource') }}
            </button>
            
            <button
              type="button"
              class="fr-btn fr-btn--secondary"
              @click="saveDraft"
              :disabled="isSubmitting"
            >
              Enregistrer comme brouillon
            </button>
            
            <router-link
              to="/ressources"
              class="fr-btn fr-btn--secondary"
              style="text-decoration: none;"
            >
              Annuler
            </router-link>
          </div>
        </div>
      </form>
    </div>

    <!-- Toast de succès -->
    <div v-if="showSuccess" class="fr-alert fr-alert--success" style="position: fixed; top: 2rem; right: 2rem; max-width: 20rem; z-index: 1000; box-shadow: 0 8px 16px rgba(0,0,0,0.15);">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const isEditing = ref(false)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const errors = ref([])
const fieldErrors = ref({})

// Options depuis l'API
const typesRessource = computed(() => configStore.typesRessource())
const typesRelation = computed(() => configStore.typesRelation())
const niveaux = computed(() => configStore.niveaux())
const niveauxPartage = computed(() => configStore.niveauxPartage())

const form = ref({
  titre: '',
  description: '',
  type_ressource: '',
  type_relation: '',
  niveau: '',
  niveau_partage: 'membres',
  contenu: '',
  duree_lecture: null,
  url_externe: '',
  url_image: '',
  tags: '',
  statut: 'publie'
})

const validateForm = () => {
  errors.value = []
  fieldErrors.value = {}
  
  if (!form.value.titre.trim()) {
    errors.value.push('Le titre est obligatoire')
    fieldErrors.value.titre = 'Ce champ est obligatoire'
  }
  
  if (!form.value.description.trim()) {
    errors.value.push('La description est obligatoire')
    fieldErrors.value.description = 'Ce champ est obligatoire'
  } else if (form.value.description.length < 20) {
    errors.value.push('La description doit contenir au moins 20 caractères')
    fieldErrors.value.description = 'Minimum 20 caractères requis'
  }
  
  if (!form.value.type_ressource) {
    errors.value.push('Le type de ressource est obligatoire')
  }
  
  if (!form.value.niveau) {
    errors.value.push('Le niveau est obligatoire')
  }
  
  if (form.value.url_externe && !isValidUrl(form.value.url_externe)) {
    errors.value.push('L\'URL externe n\'est pas valide')
  }
  
  if (form.value.url_image && !isValidUrl(form.value.url_image)) {
    errors.value.push('L\'URL de l\'image n\'est pas valide')
  }
  
  return errors.value.length === 0
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    form.value.statut = 'publie'
    
    afficherSucces(
      isEditing.value 
        ? 'Ressource modifiée avec succès' 
        : 'Ressource créée avec succès'
    )
    
    setTimeout(() => {
      router.push('/ressources')
    }, 1500)
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    errors.value = ['Une erreur est survenue lors de l\'enregistrement']
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = async () => {
  if (!form.value.titre.trim()) {
    errors.value = ['Le titre est obligatoire pour enregistrer un brouillon']
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    form.value.statut = 'brouillon'
    
    afficherSucces('Brouillon enregistré avec succès')
    
    setTimeout(() => {
      router.push('/ressources')
    }, 1500)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du brouillon:', error)
    errors.value = ['Une erreur est survenue lors de la sauvegarde']
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isSubmitting.value = false
  }
}

const afficherSucces = (message) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

onMounted(async () => {
  // Charger la configuration
  await configStore.fetchConfig()

  if (route.params.id) {
    isEditing.value = true
    // TODO: Charger la ressource depuis l'API
  }
})
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>