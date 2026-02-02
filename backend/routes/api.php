<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

// --- Authentification (Sanctum) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// --- Profil utilisateur (protégé auth:sanctum) ---
Route::put('/user/profile', [ProfileController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::put('/user/password', [ProfileController::class, 'updatePassword'])->middleware('auth:sanctum');

// --- Catégories (lecture publique) ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// --- Produits (lecture publique) ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// --- Administration (auth:sanctum + is_admin) ---
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Statistiques dashboard
    Route::get('/admin/stats', [AdminController::class, 'stats']);

    // CRUD Catégories (création, modification, suppression)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::patch('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // CRUD Produits (création, modification, suppression)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::patch('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Gestion des commandes
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::patch('/admin/orders/{order}/status', [OrderController::class, 'updateStatus']);
});
