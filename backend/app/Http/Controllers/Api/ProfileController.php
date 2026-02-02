<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * Contrôleur de profil utilisateur – BTS SIO
 * updateProfile : met à jour nom et email de l'utilisateur connecté.
 * updatePassword : change le mot de passe après vérification de l'actuel.
 * Routes protégées par auth:sanctum.
 */
class ProfileController extends Controller
{
    /**
     * Met à jour le profil de l'utilisateur connecté.
     * Valide : nom requis, email unique (sauf pour l'utilisateur actuel).
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => (bool) $user->is_admin,
            ],
        ], 200);
    }

    /**
     * Met à jour le mot de passe de l'utilisateur connecté.
     * Valide : current_password (doit correspondre), password (min 8), password_confirmation.
     * Retourne 400 si le mot de passe actuel est incorrect.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
                'errors' => [
                    'current_password' => ['Le mot de passe actuel est incorrect.'],
                ],
            ], 400);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Mot de passe mis à jour.',
        ], 200);
    }
}
