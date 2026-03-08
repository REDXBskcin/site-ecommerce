<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modèle User – BTS SIO
 * Utilisateur authentifié. Relations : orders (1-N).
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /** Colonnes autorisées pour create/update (protection assignation de masse) */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_admin',
        'address',
        'city',
        'postal_code',
        'country',
        'phone',
    ];

    /** Champs masqués dans les réponses JSON (sécurité) */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
