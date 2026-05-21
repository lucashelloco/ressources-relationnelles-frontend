import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
  // L'auth broadcasting est sur /broadcasting/auth, pas sous /api/v1/
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      // Clé correcte — authService stocke sous 'auth_token'
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      Accept: 'application/json',
    }
  }
})

export default echo
