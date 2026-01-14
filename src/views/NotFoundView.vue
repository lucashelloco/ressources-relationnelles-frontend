<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-200">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 mt-4">Page non trouvée</h2>
      <p class="text-gray-600 mt-2 mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <RouterLink to="/" class="btn-primary">
        Retour à l'accueil
      </RouterLink>
    </div>
  </div>
</template>
