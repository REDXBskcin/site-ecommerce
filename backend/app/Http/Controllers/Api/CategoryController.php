<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Contrôleur Catégories – BTS SIO
 * Lecture publique + CRUD admin (routes protégées par is_admin).
 */
class CategoryController extends Controller
{
    /** Liste toutes les catégories (ordre alphabétique) */
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::orderBy('name')->get();
        return CategoryResource::collection($categories);
    }

    /** Affiche une catégorie (route binding : {category}) */
    public function show(Category $category): CategoryResource
    {
        return new CategoryResource($category);
    }

    /** Crée une catégorie. Validation des champs pour éviter les injections. */
    public function store(Request $request): CategoryResource|JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:categories,slug'],
            'description' => ['nullable', 'string'],
        ]);
        $category = Category::create($validated);
        return new CategoryResource($category);
    }

    /** Met à jour une catégorie */
    public function update(Request $request, Category $category): CategoryResource|JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:categories,slug,' . $category->id],
            'description' => ['nullable', 'string'],
        ]);
        $category->update($validated);
        return new CategoryResource($category);
    }

    /**
     * Supprime une catégorie.
     * Vérification : on refuse si la catégorie contient des produits (intégrité référentielle).
     */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer : cette catégorie contient des produits.',
            ], 422);
        }

        $category->delete();
        return response()->json(['message' => 'Catégorie supprimée.'], 200);
    }
}
