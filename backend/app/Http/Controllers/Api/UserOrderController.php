<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Contrôleur Commandes utilisateur – BTS SIO
 * Historique des commandes de l'utilisateur connecté.
 * Protégé par auth:sanctum.
 */
class UserOrderController extends Controller
{
    /**
     * Liste les commandes de l'utilisateur connecté.
     * Eager loading items.product pour éviter N+1.
     * Tri par date décroissante (plus récent en premier).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return OrderResource::collection($orders);
    }
}
