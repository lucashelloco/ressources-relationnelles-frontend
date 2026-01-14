# 📚 Ressources Relationnelles - Frontend

Interface utilisateur Vue.js pour la plateforme de partage de ressources relationnelles.

## 🏗️ Stack technique
- Vue 3 + Composition API
- Vite
- Tailwind CSS
- Pinia (state management)
- Vue Router
- Axios

## 🚀 Installation
```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Vérifier que VITE_API_URL=http://localhost:8000/api/v1

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur : http://localhost:3000 (ou 5173)

## 🔗 Backend requis

Ce frontend nécessite que l'API backend soit lancée.
Repository : https://github.com/MLKgodx/ressources-relationnelles-api

## 🧪 Se connecter

Utilisez un des comptes de test :
- marie.lefebvre@example.com / Citoyen123!

## 📦 Build de production
```bash
npm run build
npm run preview
```

## 🎨 Structure
```
src/
├── components/      # Composants réutilisables
├── views/          # Pages de l'application
├── stores/         # Stores Pinia
├── router/         # Configuration Vue Router
└── services/       # Services API
```
