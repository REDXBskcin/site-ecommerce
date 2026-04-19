<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordCode;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    public function sendCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        // Toujours répondre 200 pour ne pas révéler si l'e-mail existe
        if (! $user) {
            return response()->json(['message' => 'Si cet e-mail est associé à un compte, vous recevrez un code.']);
        }

        // Supprimer les anciens codes pour cet e-mail
        PasswordResetCode::where('email', $request->email)->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        PasswordResetCode::create([
            'email'      => $request->email,
            'code'       => $code,
            'expires_at' => now()->addMinutes(15),
        ]);

        Mail::to($request->email)->send(new ResetPasswordCode($code));

        return response()->json(['message' => 'Si cet e-mail est associé à un compte, vous recevrez un code.']);
    }

    public function reset(Request $request): JsonResponse
    {
        $request->validate([
            'email'                 => ['required', 'email'],
            'code'                  => ['required', 'string', 'size:6'],
            'password'              => ['required', 'string', 'confirmed', Password::min(8)->letters()->numbers()->symbols()],
        ]);

        $record = PasswordResetCode::where('email', $request->email)
            ->where('code', $request->code)
            ->latest('created_at')
            ->first();

        if (! $record) {
            return response()->json(['message' => 'Code incorrect ou e-mail invalide.'], 422);
        }

        if ($record->isExpired()) {
            $record->delete();
            return response()->json(['message' => 'Ce code a expiré. Veuillez en demander un nouveau.'], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);
        $user->tokens()->delete();

        $record->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.']);
    }
}
