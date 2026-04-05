<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code'  => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        if ($user->email_verified_at) {
            $token = $user->createToken('auth-token')->plainTextToken;
            return response()->json([
                'message' => 'E-mail déjà vérifié.',
                'user'    => $this->userArray($user),
                'token'   => $token,
            ]);
        }

        if ($user->verification_code !== $request->code) {
            return response()->json(['message' => 'Code incorrect.'], 422);
        }

        if (! $user->verification_code_expires_at || $user->verification_code_expires_at->isPast()) {
            return response()->json(['message' => 'Code expiré. Veuillez en demander un nouveau.'], 422);
        }

        $user->update([
            'email_verified_at'             => now(),
            'verification_code'             => null,
            'verification_code_expires_at'  => null,
        ]);

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'E-mail vérifié avec succès.',
            'user'    => $this->userArray($user),
            'token'   => $token,
        ]);
    }

    public function resend(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Cet e-mail est déjà vérifié.'], 422);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'verification_code'            => $code,
            'verification_code_expires_at' => now()->addMinutes(15),
        ]);

        Mail::to($user->email)->send(new VerifyEmailCode($code, $user->name));

        return response()->json(['message' => 'Un nouveau code a été envoyé à votre adresse e-mail.']);
    }

    private function userArray(User $user): array
    {
        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'address'     => $user->address,
            'city'        => $user->city,
            'postal_code' => $user->postal_code,
            'role'        => $user->role,
            'is_admin'    => (bool) $user->is_admin,
            'country'     => $user->country,
            'phone'       => $user->phone,
        ];
    }
}
