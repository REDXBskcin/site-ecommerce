<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware Admin – BTS SIO
 * Vérifie que l'utilisateur est connecté ET que is_admin vaut true.
 * Sinon, renvoie 403 Forbidden.
 */
class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_admin) {
            return response()->json([
                'message' => 'Accès interdit. Droits administrateur requis.',
            ], 403);
        }

        return $next($request);
    }
}
