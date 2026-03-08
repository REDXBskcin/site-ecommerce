<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

/**
 * Contrôleur Commandes utilisateur – BTS SIO
 * Historique et création de commandes. Protégé par auth:sanctum.
 */
class UserOrderController extends Controller
{
    /**
     * Liste les commandes de l'utilisateur connecté.
     * On charge les items et produits associés pour éviter les requêtes N+1.
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

    /**
     * Crée une commande à partir du panier.
     * Validation des champs pour éviter les injections et données invalides.
     * Vérification du stock et des produits actifs avant création.
     */
    public function store(Request $request): JsonResponse|OrderResource
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $items = $validated['items'];
        $productIds = array_column($items, 'product_id');

        // Récupération des produits depuis la base (évite les requêtes multiples)
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $total = 0;
        $orderItems = [];

        foreach ($items as $item) {
            $product = $products->get($item['product_id']);
            if (!$product) {
                return response()->json(['message' => 'Produit introuvable.'], 404);
            }

            // Vérification : le produit doit être actif (en vente)
            if (!$product->is_active) {
                return response()->json([
                    'message' => "Le produit « {$product->name} » n'est plus disponible à la vente.",
                ], 422);
            }

            $qty = (int) $item['quantity'];

            // Vérification du stock disponible
            if ($product->stock < $qty) {
                return response()->json([
                    'message' => "Stock insuffisant pour « {$product->name} ». Disponible : {$product->stock}.",
                ], 422);
            }

            $price = (float) $product->price;
            $total += $price * $qty;
            $orderItems[] = [
                'product_id' => $product->id,
                'quantity' => $qty,
                'unit_price' => $price,
            ];
        }

        // Transaction : création commande + lignes + décrément du stock (tout ou rien)
        $order = DB::transaction(function () use ($user, $total, $orderItems, $validated) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => round($total, 2),
                'shipping_address' => $validated['shipping_address'] ?? null,
            ]);

            foreach ($orderItems as $row) {
                OrderProduct::create([
                    'order_id' => $order->id,
                    'product_id' => $row['product_id'],
                    'quantity' => $row['quantity'],
                    'unit_price' => $row['unit_price'],
                ]);

                // Décrément du stock du produit
                Product::where('id', $row['product_id'])
                    ->decrement('stock', $row['quantity']);
            }

            return $order->load('items.product');
        });

        return new OrderResource($order);
    }
}
