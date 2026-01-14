<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="card">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-2xl">RR</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p class="mt-2 text-gray-600">
            Rejoignez notre communauté
          </p>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="prenom" class="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                id="prenom"
                v-model="form.prenom"
                type="text"
                required
                class="input-field"
                placeholder="Jean"
              />
            </div>

            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                id="nom"
                v-model="form.nom"
                type="text"
                required
                class="input-field"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <input
              id="password"
              v-model="form.mot_de_passe"
              type="password"
              required
              minlength="8"
              class="input-field"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
          </div>

          <div>
            <label for="password_confirm" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe *
            </label>
            <input
              id="password_confirm"
              v-model="form.password_confirm"
              type="password"
              required
              minlength="8"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="cgu"
                v-model="form.cgu_accepte"
                type="checkbox"
                required
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <label for="cgu" class="ml-2 block text-sm text-gray-700">
              J'accepte les 
              <a href="#" class="text-primary-600 hover:text-primary-700">
                conditions générales d'utilisation
              </a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !form.cgu_accepte"
            class="w-full btn-primary"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création du compte...
            </span>
            <span v-else>Créer mon compte</span>
          </button>
        </form>

        <!-- Lien connexion -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Vous avez déjà un compte ?
            <RouterLink to="/login" class="text-primary-600 hover:text-primary-700 font-semibold">
              Se connecter
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref(null)

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  mot_de_passe: '',
  password_confirm: '',
  cgu_accepte: false
})

const handleRegister = async () => {
  // Vérifier que les mots de passe correspondent
  if (form.mot_de_passe !== form.password_confirm) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  error.value = null

  try {
    await authStore.register({
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      mot_de_passe: form.mot_de_passe,
      cgu_accepte: form.cgu_accepte,
      role_id: 3 // Membre par défaut
    })

    router.push('/')
  } catch (err) {
    if (err.response?.data?.errors) {
      // Erreurs de validation Laravel
      const errors = err.response.data.errors
      error.value = Object.values(errors).flat().join(', ')
    } else {
      error.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription'
    }
  } finally {
    loading.value = false
  }
}
</script>
