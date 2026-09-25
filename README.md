# Gestion des Contacts — React.js + Node.js

## Structure
```
contacts-app/
├── backend/     (API Node.js + Express)
└── frontend/    (React + Vite + react-router-dom)
```

## 1. Prérequis
- Node.js installé (v18 ou plus) → https://nodejs.org

## 2. Lancer le backend
```bash
cd backend
npm install
npm start
```
→ API disponible sur http://localhost:5000

## 3. Lancer le frontend (dans un autre terminal)
```bash
cd frontend
npm install
npm run dev
```
→ Application disponible sur http://localhost:5173

## 4. Utilisation
- Page "Liste des contacts" : affiche tous les contacts, bouton "Ajouter"
- Page "Ajouter/Modifier" : nom, prénom, upload photo, statut actif/inactif (vert/rouge)
- Modifier / Supprimer disponibles sur chaque carte

## Notes
- Les données sont stockées dans backend/data/contacts.json
- Les photos sont stockées dans backend/uploads/
- Pour la production, remplacez le stockage JSON par une vraie base de données (MongoDB, PostgreSQL...)
