<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Contrôleur Utilisateurs Admin – BTS SIO
 * CRUD utilisateurs + voir les commandes d'un utilisateur.
 * Protégé par auth:sanctum + is_admin middleware.
 */
class AdminUserController extends Controller
{
    /**
     * Liste tous les utilisateurs.
     */
    public function index(): JsonResponse
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json([
            'data' => $users->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'is_admin' => (bool) $u->is_admin,
                'created_at' => $u->created_at?->toIso8601String(),
            ]),
        ]);
    }

    /**
     * Crée un nouvel utilisateur.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['nullable', 'string', 'in:client,admin'],
            'is_admin' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'client',
            'is_admin' => $request->boolean('is_admin', false),
        ]);

        return response()->json([
            'message' => 'Utilisateur créé.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => (bool) $user->is_admin,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * Met à jour un utilisateur.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['nullable', 'string', 'in:client,admin'],
            'is_admin' => ['boolean'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => (bool) $user->is_admin,
                'created_at' => $user->created_at?->toIso8601String(),
            ],
        ], 200);
    }

    /**
     * Supprime (bannit) un utilisateur.
     * Empêche de se supprimer soi-même.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.'], 200);
    }

    /**
     * Liste les commandes d'un utilisateur.
     */
    public function orders(User $user): AnonymousResourceCollection
    {
        $orders = $user->orders()->with('items.product')->orderBy('created_at', 'desc')->get();
        return OrderResource::collection($orders);
    }
}
