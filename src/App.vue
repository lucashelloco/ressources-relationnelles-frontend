<template>
  <div id="app" class="min-h-screen flex flex-col">
    <NavBar />

    <main class="flex-grow">
      <RouterView />
    </main>

    <Footer />

    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Charger l'utilisateur si un token existe
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})
</script>

<style scoped>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
