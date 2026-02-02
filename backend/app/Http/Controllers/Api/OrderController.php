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
 * Protégé par auth:sanctum + admin middleware.
 */
class OrderController extends Controller
{
    /**
     * Liste toutes les commandes (du plus récent au plus ancien).
     */
    public function index(): AnonymousResourceCollection
    {
        $orders = Order::with('user')->orderBy('created_at', 'desc')->get();
        return OrderResource::collection($orders);
    }

    /**
     * Met à jour le statut d'une commande.
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'max:50'],
        ]);

        $order->update(['status' => $validated['status']]);
        $order->load('user');

        return response()->json([
            'message' => 'Statut mis à jour.',
            'order' => new OrderResource($order),
        ], 200);
    }
}
