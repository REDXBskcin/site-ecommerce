<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\OrderProduct;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class UserOrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return OrderResource::collection($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],
            'shipping_address'   => ['nullable', 'string', 'max:500'],
        ]);

        $productIds = collect($validated['items'])->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        foreach ($validated['items'] as $item) {
            $product = $products[$item['product_id']];
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stock insuffisant pour \"" . $product->name . "\" (disponible : " . $product->stock . ").",
                ], 422);
            }
        }

        $total = collect($validated['items'])
            ->sum(fn($item) => $products[$item['product_id']]->price * $item['quantity']);

        $order = DB::transaction(function () use ($request, $validated, $total, $products) {
            $order = $request->user()->orders()->create([
                'status'           => 'pending',
                'total'            => $total,
                'shipping_address' => $validated['shipping_address'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                OrderProduct::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $products[$item['product_id']]->price,
                ]);

                Product::where('id', $item['product_id'])
                    ->where('stock', '>=', $item['quantity'])
                    ->decrement('stock', $item['quantity']);
            }

            return $order->load('items.product');
        });

        return response()->json([
            'message' => 'Commande créée avec succès.',
            'data'    => new OrderResource($order),
        ], 201);
    }
}
