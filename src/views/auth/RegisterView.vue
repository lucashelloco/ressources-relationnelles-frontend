<template>
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;background:#F5F5F5;">
    <div style="width:100%;max-width:440px;">

      <!-- Logo -->
      <div style="text-align:center;margin-bottom:1.75rem;">
        <div style="width:52px;height:52px;background:#000091;border-radius:4px;display:flex;align-items:center;justify-content:center;margin:0 auto .875rem;">
          <span style="color:#fff;font-weight:800;font-size:1.1rem;">RE</span>
        </div>
        <h1 style="font-size:1.5rem;font-weight:800;color:#161616;margin:0 0 .375rem;">Créer un compte</h1>
        <p style="color:#666666;font-size:.85rem;margin:0;">Rejoignez la communauté (RE)SOURCES</p>
      </div>

      <!-- Card -->
      <div style="background:#FFFFFF;border:1px solid #DDDDDD;border-radius:4px;padding:1.75rem;box-shadow:0 2px 8px rgba(0,0,0,.06);">

        <!-- Erreur -->
        <div v-if="error" style="background:#FFE9E9;border:1px solid #E1000F;border-left-width:4px;border-radius:3px;padding:.75rem 1rem;margin-bottom:1.25rem;">
          <p style="margin:0;color:#C9191E;font-size:.8rem;">{{ error }}</p>
        </div>

        <form @submit.prevent="handleRegister" style="display:flex;flex-direction:column;gap:.875rem;">

          <!-- Prénom / Nom -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
            <div>
              <label style="display:block;color:#161616;font-size:.875rem;font-weight:500;margin-bottom:.3rem;">Prénom *</label>
              <input v-model="form.prenom" type="text" required class="input-dsfr" placeholder="Jean" />
            </div>
            <div>
              <label style="display:block;color:#161616;font-size:.875rem;font-weight:500;margin-bottom:.3rem;">Nom *</label>
              <input v-model="form.nom" type="text" required class="input-dsfr" placeholder="Dupont" />
            </div>
          </div>

          <div>
            <label style="display:block;color:#161616;font-size:.875rem;font-weight:500;margin-bottom:.3rem;">Email *</label>
            <input v-model="form.email" type="email" required class="input-dsfr" placeholder="jean.dupont@example.com" />
          </div>

          <div>
            <label style="display:block;color:#161616;font-size:.875rem;font-weight:500;margin-bottom:.3rem;">Mot de passe *</label>
            <input v-model="form.mot_de_passe" type="password" required minlength="8" class="input-dsfr" placeholder="••••••••" />
            <p style="margin:.25rem 0 0;font-size:.75rem;color:#666666;">Minimum 8 caractères</p>
          </div>

          <div>
            <label style="display:block;color:#161616;font-size:.875rem;font-weight:500;margin-bottom:.3rem;">Confirmer le mot de passe *</label>
            <input v-model="form.password_confirm" type="password" required minlength="8" class="input-dsfr" placeholder="••••••••" />
          </div>

          <div style="display:flex;align-items:flex-start;gap:.5rem;">
            <input id="cgu" v-model="form.cgu_accepte" type="checkbox" required style="width:16px;height:16px;accent-color:#000091;cursor:pointer;flex-shrink:0;margin-top:2px;" />
            <label for="cgu" style="font-size:.875rem;color:#4A4A4A;cursor:pointer;line-height:1.5;">
              J'accepte les
              <a href="#" style="color:#000091;text-decoration:none;">conditions générales d'utilisation</a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !form.cgu_accepte"
            style="width:100%;margin-top:.25rem;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1.5rem;background:#000091;color:#fff;border:none;border-radius:4px;font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s;"
            @mouseover="e=>{ if(!loading && form.cgu_accepte) e.currentTarget.style.background='#1212FF'; }"
            @mouseleave="e=>e.currentTarget.style.background='#000091'"
          >
            <span v-if="loading" style="display:flex;align-items:center;gap:.5rem;">
              <div class="fr-spinner" style="width:1rem;height:1rem;border-width:2px;"></div>
              Création…
            </span>
            <span v-else>Créer mon compte</span>
          </button>
        </form>

      </div>

      <!-- Lien connexion -->
      <p style="text-align:center;margin-top:1.25rem;font-size:.85rem;color:#666666;">
        Déjà un compte ?
        <RouterLink to="/login" style="color:#000091;text-decoration:none;font-weight:600;">Se connecter</RouterLink>
      </p>

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
const error   = ref(null)

const form = reactive({
  prenom: '', nom: '', email: '',
  mot_de_passe: '', password_confirm: '',
  cgu_accepte: false
})

const handleRegister = async () => {
  if (form.mot_de_passe !== form.password_confirm) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  loading.value = true
  error.value   = null
  try {
    await authStore.register({
      prenom: form.prenom, nom: form.nom, email: form.email,
      mot_de_passe: form.mot_de_passe, cgu_accepte: form.cgu_accepte, role_id: 3
    })
    router.push('/')
  } catch (err) {
    if (err.response?.data?.errors) {
      error.value = Object.values(err.response.data.errors).flat().join(', ')
    } else {
      error.value = err.response?.data?.message || 'Une erreur est survenue'
    }
  } finally {
    loading.value = false
  }
}
</script>
