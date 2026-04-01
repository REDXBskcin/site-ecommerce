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
            'items'                  => ['required', 'array', 'min:1'],
            'items.*.product_id'     => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'       => ['required', 'integer', 'min:1'],
            'items.*.unit_price'     => ['required', 'numeric', 'min:0'],
            'shipping_address'       => ['nullable', 'string', 'max:500'],
        ]);

        $total = collect($validated['items'])
            ->sum(fn($item) => $item['unit_price'] * $item['quantity']);

        $order = DB::transaction(function () use ($request, $validated, $total) {
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
                    'unit_price' => $item['unit_price'],
                ]);

                Product::where('id', $item['product_id'])
                    ->where('stock', '>', 0)
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
