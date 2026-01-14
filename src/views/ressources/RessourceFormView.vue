<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">
        {{ isEdit ? 'Modifier la ressource' : 'Nouvelle ressource' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-8">
        <div class="space-y-6">
          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              v-model="form.titre"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- Type et Niveau -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                v-model="form.type_ressource"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="article">Article</option>
                <option value="video">Vidéo</option>
                <option value="podcast">Podcast</option>
                <option value="infographie">Infographie</option>
                <option value="guide">Guide</option>
                <option value="etude">Étude</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Niveau *</label>
              <select
                v-model="form.niveau"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>
          </div>

          <!-- Contenu -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
            <textarea
              v-model="form.contenu"
              rows="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- URL externe et image -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL externe</label>
              <input
                v-model="form.url_externe"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
              <input
                v-model="form.url_image"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Statut et Niveau de partage -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                v-model="form.statut"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="brouillon">Brouillon</option>
                <option value="publie">Publié</option>
                <option value="archive">Archivé</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Partage</label>
              <select
                v-model="form.niveau_partage"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="prive">Privé</option>
                <option value="membres">Membres uniquement</option>
              </select>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              {{ isEdit ? 'Mettre à jour' : 'Créer' }}
            </button>
            <router-link
              to="/ressources"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition text-center"
            >
              Annuler
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRessourcesStore } from '@/stores/ressources'

const route = useRoute()
const router = useRouter()
const ressourcesStore = useRessourcesStore()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  titre: '',
  description: '',
  contenu: '',
  type_ressource: 'article',
  niveau: 'debutant',
  statut: 'brouillon',
  niveau_partage: 'public',
  url_externe: '',
  url_image: '',
  auteur_id: 1 // TODO: Récupérer depuis l'utilisateur connecté
})

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await ressourcesStore.updateRessource(route.params.id, form.value)
    } else {
      await ressourcesStore.createRessource(form.value)
    }
    router.push('/ressources')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Une erreur est survenue')
  }
}

onMounted(async () => {
  if (isEdit.value) {
    const ressource = await ressourcesStore.fetchRessource(route.params.id)
    if (ressource) {
      Object.assign(form.value, ressource)
    }
  }
})
</script>
