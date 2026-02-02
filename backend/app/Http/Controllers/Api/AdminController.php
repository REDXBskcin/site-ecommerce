<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur Admin – BTS SIO
 * Statistiques et données pour le dashboard admin.
 * Protégé par auth:sanctum + admin middleware.
 */
class AdminController extends Controller
{
    /**
     * Statistiques du dashboard : nombre de commandes, chiffre d'affaires.
     */
    public function stats(Request $request): JsonResponse
    {
        $totalOrders = Order::count();
        $totalRevenue = (float) Order::sum('total');

        return response()->json([
            'total_orders' => $totalOrders,
            'total_revenue' => round($totalRevenue, 2),
        ]);
    }
}
