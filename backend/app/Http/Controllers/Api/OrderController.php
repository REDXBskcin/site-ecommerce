<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Contrôleur Commandes Admin – BTS SIO
 * Liste et mise à jour du statut des commandes.
 * Protégé par auth:sanctum + is_admin middleware.
 */
class OrderController extends Controller
{
    /** Statuts autorisés (référence le modèle Order pour cohérence) */

    /**
     * Liste toutes les commandes (du plus récent au plus ancien).
     * Query param : status pour filtrer (ex. ?status=pending).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $orders->where('status', $request->status);
        }

        return OrderResource::collection($orders->get());
    }

    /**
     * Met à jour le statut d'une commande.
     * Validation : le statut doit être dans la liste autorisée.
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', Order::STATUSES)],
        ]);

        $order->update(['status' => $validated['status']]);
        $order->load('user');

        return response()->json([
            'message' => 'Statut mis à jour.',
            'order' => new OrderResource($order),
        ], 200);
    }
}
