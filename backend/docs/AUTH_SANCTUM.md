# Authentification API avec Laravel Sanctum (BTS SIO)

## Installation effectuée

- **laravel/sanctum** installé via Composer.
- Migration **personal_access_tokens** publiée (table des tokens).
- Modèle **User** : trait **HasApiTokens** + champ **role** dans `$fillable`.
- **AuthController** : `register`, `login`, `logout`.
- **AppServiceProvider** : `Schema::defaultStringLength(191)` pour éviter l’erreur MySQL "key too long".

## Table personal_access_tokens

Si la table n’existe pas ou si tu as une erreur lors de l’inscription/connexion :

1. Dans **phpMyAdmin**, base `site_ecommerce` :  
   **SQL** → `DROP TABLE IF EXISTS personal_access_tokens;` → Exécuter.
2. En ligne de commande dans le dossier backend :  
   `php artisan migrate --path=database/migrations/2026_02_01_161342_create_personal_access_tokens_table.php`

## Routes API

| Méthode | URL        | Accès   | Action |
|--------|------------|--------|--------|
| POST   | /api/register | Public | Inscription (nom, email, password, password_confirmation) → user + token |
| POST   | /api/login    | Public | Connexion (email, password) → user + token |
| POST   | /api/logout   | Protégé (auth:sanctum) | Suppression du token actuel |

## Utilisation

### Inscription (POST /api/register)

Corps JSON :

```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "secret123",
  "password_confirmation": "secret123"
}
```

Réponse 201 : `{ "message", "user": { "id", "name", "email", "role" }, "token", "token_type": "Bearer" }`.

### Connexion (POST /api/login)

Corps JSON :

```json
{
  "email": "jean@example.com",
  "password": "secret123"
}
```

Réponse 200 : `{ "message", "user", "token", "token_type": "Bearer" }`.

### Déconnexion (POST /api/logout)

Header : `Authorization: Bearer {token}`.

Réponse 200 : `{ "message": "Déconnexion réussie." }`.

## Protéger une route

Dans `routes/api.php` :

```php
Route::get('/mon-endpoint', [MonController::class, 'methode'])->middleware('auth:sanctum');
```

Seules les requêtes avec un token valide dans `Authorization: Bearer ...` seront acceptées.
