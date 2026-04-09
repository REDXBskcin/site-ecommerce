<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'name'                         => $validated['name'],
            'email'                        => $validated['email'],
            'password'                     => $validated['password'],
            'role'                         => 'client',
            'verification_code'            => $code,
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        try {
            Mail::to($user->email)->send(new VerifyEmailCode($code, $user->name));
        } catch (\Throwable $e) {
            $user->delete();
            return response()->json([
                'message' => 'Impossible d\'envoyer l\'e-mail de vérification. Vérifiez la configuration mail du serveur. (' . $e->getMessage() . ')',
            ], 500);
        }

        return response()->json([
            'message'            => 'Compte créé. Veuillez vérifier votre adresse e-mail.',
            'needs_verification' => true,
            'email'              => $user->email,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $user = User::where('email', $validated['email'])->firstOrFail();

        // Suppression des anciens tokens : un seul appareil connecté à la fois (choix pédagogique)
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'address' => $user->address,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'role' => $user->role,
                'is_admin' => (bool) $user->is_admin,
                'country' => $user->country,
                'phone' => $user->phone,
            ],
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'address' => $request->user()->address,
                'city' => $request->user()->city,
                'postal_code' => $request->user()->postal_code,
                'role' => $request->user()->role,
                'is_admin' => (bool) $request->user()->is_admin,
                'country' => $request->user()->country,
                'phone' => $request->user()->phone,
            ],
        ]);
    }
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.'], 200);
    }
}
