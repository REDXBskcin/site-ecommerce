<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modèle Category – BTS SIO
 *
 * Représente une catégorie de produits (ex. : Électronique, Vêtements).
 * Une catégorie peut avoir plusieurs produits (relation 1-N).
 */
class Category extends Model
{
    use HasFactory;

    /**
     * Table associée au modèle (convention Laravel : "categories" = nom de la table).
     */
    protected $table = 'categories';

    /**
     * Colonnes autorisées pour l'assignation de masse (create/update).
     * Protège contre l'injection de champs non souhaités.
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Relation : une catégorie possède plusieurs produits.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
