<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rules\Password;

class AdminUserController extends Controller
{
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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()->symbols()],
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

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'confirmed', Password::min(8)->letters()->numbers()->symbols()],
            'role' => ['nullable', 'string', 'in:client,admin'],
            'is_admin' => ['boolean'],
        ]);

        unset($validated['password_confirmation']);
        if (empty($validated['password'])) {
            unset($validated['password']);
        }
        $user->fill(array_filter($validated, fn ($v) => $v !== null));
        $user->save();

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

    public function orders(User $user): AnonymousResourceCollection
    {
        $orders = $user->orders()->with('items.product')->orderBy('created_at', 'desc')->get();
        return OrderResource::collection($orders);
    }
}
