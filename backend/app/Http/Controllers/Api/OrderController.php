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
     * Query param : status (processing, delivered, etc.) pour filtrer.
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
