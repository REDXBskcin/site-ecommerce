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

- Par défaut, l'app appelle `http://127.0.0.1:8000/api/products`.
- Si l'API n'est pas disponible, les **données mock** sont affichées.
- Pour changer l'URL : créer un fichier `.env` avec `VITE_API_URL=http://...`.

## Structure

- `src/pages/Home.jsx` : page d'accueil, grille de produits
- `src/components/ProductCard.jsx` : carte produit (image, prix, bouton « Ajouter au panier »)
- `src/services/api.js` : axios + `getProducts()`
- `src/data/mockProducts.js` : données fictives

## Build

```bash
npm run build
npm run preview
```
