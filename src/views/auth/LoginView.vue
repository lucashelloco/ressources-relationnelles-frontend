<template>
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:#F5F5F5;">
    <div style="width:100%;max-width:400px;">

      <!-- Logo -->
      <div style="text-align:center;margin-bottom:2rem;">
        <div style="width:52px;height:52px;background:#000091;border-radius:4px;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <span style="color:#fff;font-weight:800;font-size:1.1rem;">RE</span>
        </div>
        <h1 style="font-size:1.5rem;font-weight:800;color:#161616;margin:0 0 .375rem;">Connexion</h1>
        <p style="color:#666666;font-size:.85rem;margin:0;">Accédez à votre compte</p>
      </div>

      <!-- Card -->
      <div style="background:#FFFFFF;border:1px solid #DDDDDD;border-radius:4px;padding:1.75rem;box-shadow:0 2px 8px rgba(0,0,0,.06);">

        <!-- Erreur -->
        <div v-if="error" style="background:#FFE9E9;border:1px solid #E1000F;border-left-width:4px;border-radius:3px;padding:.75rem 1rem;margin-bottom:1.25rem;">
          <p style="margin:0;color:#C9191E;font-size:.8rem;">{{ error }}</p>
        </div>

        <form @submit.prevent="handleLogin" style="display:flex;flex-direction:column;gap:1rem;">
          <div>
            <label style="display:block;color:#161616;font-size:.875rem;font-weight:500;margin-bottom:.375rem;">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-dsfr"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.375rem;">
              <label style="color:#161616;font-size:.875rem;font-weight:500;">Mot de passe</label>
              <a href="#" style="font-size:.75rem;color:#000091;text-decoration:none;" @mouseover="e=>e.target.style.color='#1212FF'" @mouseleave="e=>e.target.style.color='#000091'">Mot de passe oublié ?</a>
            </div>
            <input
              v-model="form.mot_de_passe"
              type="password"
              required
              class="input-dsfr"
              placeholder="••••••••"
            />
          </div>

          <div style="display:flex;align-items:center;gap:.5rem;">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              style="width:16px;height:16px;accent-color:#000091;cursor:pointer;"
            />
            <label for="remember" style="font-size:.875rem;color:#4A4A4A;cursor:pointer;">Se souvenir de moi</label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            style="width:100%;margin-top:.25rem;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1.5rem;background:#000091;color:#fff;border:none;border-radius:4px;font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s;"
            @mouseover="e=>{ if(!loading) e.currentTarget.style.background='#1212FF'; }"
            @mouseleave="e=>e.currentTarget.style.background='#000091'"
          >
            <span v-if="loading" style="display:flex;align-items:center;gap:.5rem;">
              <div class="fr-spinner" style="width:1rem;height:1rem;border-width:2px;"></div>
              Connexion…
            </span>
            <span v-else>Se connecter</span>
          </button>
        </form>

      </div>

      <!-- Lien inscription -->
      <p style="text-align:center;margin-top:1.25rem;font-size:.85rem;color:#666666;">
        Pas encore de compte ?
        <RouterLink to="/register" style="color:#000091;text-decoration:none;font-weight:600;">S'inscrire</RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route  = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error   = ref(null)

const form = reactive({
  email: '',
  mot_de_passe: '',
  remember: false
})

const handleLogin = async () => {
  loading.value = true
  error.value   = null
  try {
    await authStore.login({ email: form.email, mot_de_passe: form.mot_de_passe })
    router.push(route.query.redirect || '/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>
