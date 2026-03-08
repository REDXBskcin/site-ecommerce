<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OrderController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Order::with('user')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->get();
        return OrderResource::collection($orders);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['user', 'items.product']);
        return response()->json([
            'data' => new OrderResource($order),
        ], 200);
    }

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
