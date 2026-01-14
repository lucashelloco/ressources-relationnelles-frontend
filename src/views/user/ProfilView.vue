<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Mon Profil</h1>

      <!-- Carte d'information utilisateur -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-6">
        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {{ userInitials }}
            </div>
          </div>

          <!-- Informations -->
          <div class="flex-1">
            <h2 class="text-2xl font-semibold mb-2">{{ user.prenom }} {{ user.nom }}</h2>
            <p class="text-gray-600 mb-4">
              <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ user.role }}
              </span>
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">{{ user.email }}</p>
              </div>
              <div v-if="user.telephone">
                <p class="text-sm text-gray-500">Téléphone</p>
                <p class="font-medium">{{ user.telephone }}</p>
              </div>
              <div v-if="user.ville">
                <p class="text-sm text-gray-500">Ville</p>
                <p class="font-medium">{{ user.ville }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Membre depuis</p>
                <p class="font-medium">{{ formatDate(user.created_at) }}</p>
              </div>
            </div>

            <div class="mt-6">
              <button
                @click="editMode = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                ✏️ Modifier mon profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <p class="text-3xl font-bold text-blue-600 mb-2">{{ stats.ressources }}</p>
          <p class="text-gray-600">Ressources créées</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <p class="text-3xl font-bold text-red-600 mb-2">{{ stats.favoris }}</p>
          <p class="text-gray-600">Favoris</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6 text-center">
          <p class="text-3xl font-bold text-purple-600 mb-2">{{ stats.activites }}</p>
          <p class="text-gray-600">Activités</p>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Actions rapides</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            to="/user/mes-ressources"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span class="text-2xl">📚</span>
            <div>
              <p class="font-medium">Mes ressources</p>
              <p class="text-sm text-gray-600">Gérer mes publications</p>
            </div>
          </router-link>

          <router-link
            to="/user/mes-favoris"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition"
          >
            <span class="text-2xl">❤️</span>
            <div>
              <p class="font-medium">Mes favoris</p>
              <p class="text-sm text-gray-600">Ressources sauvegardées</p>
            </div>
          </router-link>

          <router-link
            to="/user/mes-activites"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
          >
            <span class="text-2xl">📅</span>
            <div>
              <p class="font-medium">Mes activités</p>
              <p class="text-sm text-gray-600">Événements inscrits</p>
            </div>
          </router-link>

          <router-link
            to="/ressources/new"
            class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
          >
            <span class="text-2xl">➕</span>
            <div>
              <p class="font-medium">Nouvelle ressource</p>
              <p class="text-sm text-gray-600">Créer du contenu</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const editMode = ref(false)

// TODO: Récupérer les vraies données depuis l'API
const user = ref({
  prenom: 'Marie',
  nom: 'Lefebvre',
  email: 'marie.lefebvre@example.com',
  telephone: '06 12 34 56 78',
  ville: 'Paris',
  role: 'Citoyen Connecté',
  created_at: '2026-01-13T14:26:08.000000Z'
})

const stats = ref({
  ressources: 0,
  favoris: 0,
  activites: 0
})

const userInitials = computed(() => {
  return (user.value.prenom[0] + user.value.nom[0]).toUpperCase()
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>
