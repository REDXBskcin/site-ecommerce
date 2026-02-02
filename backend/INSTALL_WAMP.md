# Installation Laravel + WAMP (BTS SIO)

## 1. Utiliser ce dossier comme backend

- **Option A** : Renommer le dossier `backend_new` en `backend` (supprimer l’ancien dossier `backend` s’il existe, puis renommer `backend_new` → `backend`).
- **Option B** : Garder le nom `backend_new` et l’utiliser comme projet Laravel.

## 2. Créer la base MySQL dans WAMP

1. Démarrer **WAMP** (icône verte).
2. Ouvrir **phpMyAdmin** : http://localhost/phpmyadmin
3. Créer une nouvelle base : nom **`site_ecommerce`**, interclassement **utf8mb4_general_ci** (ou par défaut).

## 3. Importer le fichier SQL complet

1. Dans phpMyAdmin, sélectionner la base **site_ecommerce**.
2. Onglet **Importer** (Import).
3. Choisir le fichier : **`database/site_ecommerce.sql`** (dans ce projet).
4. Cliquer sur **Exécuter**.

Les tables (users, categories, products, orders, order_product, etc.) et les données de test (catégories + 7 produits) sont créées.

## 4. Configurer Laravel pour MySQL

1. Copier `.env.example` en `.env` si ce n’est pas déjà fait :
   ```bash
   copy .env.example .env
   ```
2. Ouvrir **`.env`** et configurer la base :
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=site_ecommerce
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Générer la clé d’application (si pas déjà fait) :
   ```bash
   php artisan key:generate
   ```

## 5. Démarrer l’API

```bash
php artisan serve
```

Ouvrir **http://localhost:8000/api/products** : la liste des produits en JSON doit s’afficher.

## Fichier SQL complet

Le fichier **`database/site_ecommerce.sql`** contient :

- Création des tables : `users` (avec colonne `role`), `categories`, `products`, `orders`, `order_product`, + tables Laravel (sessions, cache, jobs, etc.).
- Insertion de 3 catégories et 7 produits de test (Tech Store).

Tu peux le copier où tu veux ; l’importer dans phpMyAdmin sur la base **site_ecommerce** suffit pour avoir la structure et les données.
