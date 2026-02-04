<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur Admin – BTS SIO
 * Statistiques globales pour le dashboard admin.
 * Protégé par auth:sanctum + is_admin middleware.
 */
class AdminController extends Controller
{
    /**
     * Statistiques globales : users, produits, commandes, chiffre d'affaires.
     */
    public function stats(Request $request): JsonResponse
    {
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalRevenue = (float) Order::sum('total');

        return response()->json([
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'total_revenue' => round($totalRevenue, 2),
        ]);
    }
}
