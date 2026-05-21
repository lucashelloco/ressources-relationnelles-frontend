<template>
  <footer style="background:#F5F5F5;border-top:4px solid #000091;margin-top:auto;" class="hidden md:block">
    <div class="container-app" style="padding-top:2.5rem;padding-bottom:1.5rem;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:2rem;margin-bottom:2rem;">

        <!-- Branding -->
        <div>
          <div style="display:flex;align-items:center;gap:.625rem;margin-bottom:.875rem;">
            <div style="width:36px;height:36px;background:#000091;border-radius:4px;display:flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-weight:800;font-size:.8rem;">RE</span>
            </div>
            <div>
              <div style="color:#000091;font-weight:700;font-size:.8rem;">(RE)SOURCES</div>
              <div style="color:#4A4A4A;font-size:.65rem;">RELATIONNELLES</div>
            </div>
          </div>
          <p style="font-size:.8rem;color:#666;line-height:1.6;">
            Plateforme numérique citoyenne dédiée à l'amélioration des relations humaines.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 style="color:#000091;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.875rem;border-bottom:2px solid #000091;padding-bottom:.375rem;display:inline-block;">Navigation</h4>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem;">
            <li><RouterLink to="/ressources" style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">Ressources</RouterLink></li>
            <li><RouterLink to="/activites"  style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">Activités</RouterLink></li>
            <li><RouterLink to="/register"   style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">Créer un compte</RouterLink></li>
          </ul>
        </div>

        <!-- Légal -->
        <div>
          <h4 style="color:#000091;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.875rem;border-bottom:2px solid #000091;padding-bottom:.375rem;display:inline-block;">Légal</h4>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem;">
            <li><a href="#" style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">Mentions légales</a></li>
            <li><a href="#" style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">Confidentialité</a></li>
            <li><a href="#" style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">CGU</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 style="color:#000091;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.875rem;border-bottom:2px solid #000091;padding-bottom:.375rem;display:inline-block;">Contact</h4>
          <a href="mailto:contact@ressources-relationnelles.fr" style="color:#4A4A4A;text-decoration:none;font-size:.8rem;transition:color .15s;display:block;margin-bottom:.875rem;" @mouseover="e=>e.target.style.color='#000091'" @mouseleave="e=>e.target.style.color='#4A4A4A'">
            contact@ressources-rel.fr
          </a>
          <div style="display:flex;gap:.75rem;">
            <a href="#" style="color:#4A4A4A;transition:color .15s;" @mouseover="e=>e.currentTarget.style.color='#000091'" @mouseleave="e=>e.currentTarget.style.color='#4A4A4A'">
              <svg style="width:18px;height:18px;" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" style="color:#4A4A4A;transition:color .15s;" @mouseover="e=>e.currentTarget.style.color='#000091'" @mouseleave="e=>e.currentTarget.style.color='#4A4A4A'">
              <svg style="width:18px;height:18px;" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div style="border-top:1px solid #DDDDDD;padding-top:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem;">
        <p style="margin:0;font-size:.75rem;color:#666;">
          &copy; {{ new Date().getFullYear() }} (RE)SOURCES RELATIONNELLES. Tous droits réservés.
        </p>
        <div style="display:flex;align-items:center;gap:.5rem;">
          <div style="width:6px;height:6px;background:#00A95F;border-radius:50%;"></div>
          <span style="font-size:.7rem;color:#666;">Application web + PWA mobile</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
