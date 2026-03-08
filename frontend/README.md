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

- Par défaut l'app appelle `http://127.0.0.1:8000/api`.
- Pour changer l'URL : fichier `.env` avec `VITE_API_URL=http://...`.

## Structure

- `src/pages/` : pages (accueil, produit, panier, compte, admin...)
- `src/components/` : Layout, ProductCard, etc.
- `src/services/api.js` : appels API

## Build

```bash
npm run build
npm run preview
```
