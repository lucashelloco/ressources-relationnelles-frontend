<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="card">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-2xl">RR</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Connexion</h2>
          <p class="mt-2 text-gray-600">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.mot_de_passe"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <a href="#" class="text-sm text-primary-600 hover:text-primary-700">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </form>

        <!-- Lien inscription -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Pas encore de compte ?
            <RouterLink to="/register" class="text-primary-600 hover:text-primary-700 font-semibold">
              S'inscrire
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref(null)

const form = reactive({
  email: '',
  mot_de_passe: '',
  remember: false
})

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    await authStore.login({
      email: form.email,
      mot_de_passe: form.mot_de_passe
    })

    // Redirection vers la page d'origine ou vers l'accueil
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (err) {
    error.value = err.response?.data?.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>
