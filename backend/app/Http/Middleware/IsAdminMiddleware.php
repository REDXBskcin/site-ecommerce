<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware IsAdmin – BTS SIO
 * Vérifie que l'utilisateur est connecté ET que is_admin est true.
 * Sinon, renvoie 403 Forbidden.
 */
class IsAdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user || !$user->is_admin) {
            return response()->json([
                'message' => 'Accès interdit. Droits administrateur requis.',
            ], 403);
        }

        return $next($request);
    }
}
