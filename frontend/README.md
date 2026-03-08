# Frontend React – Tech Store (BTS SIO)

## Stack

- **React 18** + **Vite**
- **Tailwind CSS** (thème Tech Store)
- **axios** (requêtes HTTP vers l'API Laravel)
- **react-router-dom** (navigation)

## Installation

```bash
cd frontend
npm install
```

## Lancer en dev

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173).

## Connexion à l'API Laravel

- Par défaut, l'app appelle `http://127.0.0.1:8000/api`.
- Le backend Laravel doit être démarré : `php artisan serve` (dans le dossier backend).
- Pour changer l'URL : créer un fichier `.env` avec `VITE_API_URL=http://...`.

## Structure

- `src/pages/Home.jsx` : page d'accueil, grille de produits
- `src/components/ProductCard.jsx` : carte produit (image, prix, bouton « Ajouter au panier »)
- `src/services/api.js` : axios + fonctions d'appel API (getProducts, getCategories, etc.)

## Build

```bash
npm run build
npm run preview
```
