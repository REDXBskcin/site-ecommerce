<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],
    'allowed_methods' => ['*'],
    
    // On autorise l'URL locale et celle définie dans le .env (Railway)
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    
    // L'astuce magique : On autorise TOUS les liens générés par Vercel !
    'allowed_origins_patterns' => ['#^https://.*\.vercel\.app$#'],
    
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    
    // Doit être sur "true" pour que la connexion et le panier fonctionnent
    'supports_credentials' => true,
];