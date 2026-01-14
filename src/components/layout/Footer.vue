<template>
  <footer class="bg-gray-900 text-gray-300 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- À propos -->
        <div>
          <h3 class="text-white font-semibold mb-4">À propos</h3>
          <p class="text-sm">
            (RE)SOURCES RELATIONNELLES est une plateforme dédiée à l'amélioration des relations humaines.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-white font-semibold mb-4">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink to="/ressources" class="hover:text-white transition-colors">
                Ressources
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/activites" class="hover:text-white transition-colors">
                Activités
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="hover:text-white transition-colors">
                À propos
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Légal -->
        <div>
          <h3 class="text-white font-semibold mb-4">Informations légales</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Mentions légales
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition-colors">
                CGU
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="mailto:contact@ressources-relationnelles.fr" class="hover:text-white transition-colors">
                contact@ressources-relationnelles.fr
              </a>
            </li>
            <li class="flex space-x-4 pt-4">
              <a href="#" class="hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
        <p>&copy; {{ new Date().getFullYear() }} (RE)SOURCES RELATIONNELLES. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
