/**
 * services/api.js – Tech Store (BTS SIO)
 *
 * Ce fichier centralise TOUS les appels HTTP vers l'API Laravel.
 * On utilise axios, configuré avec l'URL de base définie dans .env (VITE_API_URL).
 * Le token d'authentification Sanctum est injecté automatiquement par AuthContext.
 *
 * Sections :
 *   1. Configuration axios
 *   2. Produits & Catégories (public)
 *   3. Admin – Produits
 *   4. Admin – Commandes
 *   5. Admin – Utilisateurs
 *   6. Commandes utilisateur connecté
 *   7. Authentification & Vérification e-mail
 */

import axios from 'axios'

// URL de base de l'API — définie dans .env (VITE_API_URL) ou localhost en développement
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const STORAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '')

// ─────────────────────────────────────────────
// Utilitaire : construire l'URL d'une image produit
// Gère les cas : URL absolue, chemin relatif, mode DEV/PROD
// ─────────────────────────────────────────────
export function getProductImageUrl(product) {
  const url = product?.image_url || product?.image
  if (!url || typeof url !== 'string') return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (import.meta.env.DEV) {
      try {
        return new URL(url).pathname
      } catch {
        return url
      }
    }
    return url
  }

  if (url.startsWith('/')) {
    return import.meta.env.DEV ? url : STORAGE_BASE_URL + url
  }
  return import.meta.env.DEV ? '/' + url : STORAGE_BASE_URL + '/' + url
}

// ─────────────────────────────────────────────
// 1. Configuration de l'instance axios
// ─────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercepteur : si les données sont un FormData (upload image),
// on retire le Content-Type pour laisser le navigateur le définir lui-même
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// ─────────────────────────────────────────────
// 2. Produits & Catégories (accès public)
// ─────────────────────────────────────────────

// Récupérer la liste paginée des produits, avec filtres optionnels (recherche, catégorie)
export async function getProducts(page = 1, filters = {}) {
  const params = { page }
  if (filters.search?.trim()) params.search = filters.search.trim()
  if (filters.category_id) params.category_id = filters.category_id
  const response = await api.get('/products', { params })
  return response.data
}

// Récupérer un seul produit par son identifiant
export async function getProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data.data ?? response.data
}

// Récupérer toutes les catégories
export async function getCategories() {
  const response = await api.get('/categories')
  return response.data.data ?? response.data
}

// ─────────────────────────────────────────────
// 3. Admin – Gestion des produits
// ─────────────────────────────────────────────

// Récupérer tous les produits (actifs et inactifs) pour la liste admin
export async function getAdminProducts() {
  const response = await api.get('/products', {
    params: { per_page: 500, active: 0 },
  })
  return response.data.data ?? response.data
}

// Créer un nouveau produit (FormData pour l'upload d'image)
export async function createProduct(formData) {
  const response = await api.post('/admin/products', formData)
  return response.data.data ?? response.data
}

// Modifier un produit existant (POST avec _method=PUT pour les formulaires multipart)
export async function updateProduct(id, formData) {
  formData.append('_method', 'PUT')
  const response = await api.post(`/admin/products/${id}`, formData)
  return response.data.data ?? response.data
}

// Supprimer un produit
export async function deleteProduct(id) {
  await api.delete(`/admin/products/${id}`)
}

// ─────────────────────────────────────────────
// 4. Admin – Gestion des commandes
// ─────────────────────────────────────────────

// Récupérer toutes les commandes
export async function getAdminOrders() {
  const response = await api.get('/admin/orders')
  return response.data.data ?? response.data
}

// Récupérer le détail d'une commande (avec ses produits)
export async function getAdminOrderById(orderId) {
  const response = await api.get(`/admin/orders/${orderId}`)
  return response.data.data ?? response.data
}

// Modifier le statut d'une commande (ex: "en cours" → "expédié")
export async function updateOrderStatus(orderId, status) {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status })
  return response.data.order ?? response.data
}

// ─────────────────────────────────────────────
// 5. Admin – Gestion des utilisateurs
// ─────────────────────────────────────────────

// Récupérer la liste de tous les utilisateurs
export async function getAdminUsers() {
  const response = await api.get('/admin/users')
  return response.data.data ?? response.data
}

// Créer un utilisateur depuis le panneau admin
export async function createUser(payload) {
  const response = await api.post('/admin/users', payload)
  return response.data.user ?? response.data
}

// Modifier un utilisateur (rôle, informations, etc.)
export async function updateUserAdmin(userId, payload) {
  const response = await api.put(`/admin/users/${userId}`, payload)
  return response.data.user ?? response.data
}

// Supprimer un utilisateur
export async function deleteUserAdmin(userId) {
  await api.delete(`/admin/users/${userId}`)
}

// Voir les commandes d'un utilisateur spécifique
export async function getAdminUserOrders(userId) {
  const response = await api.get(`/admin/users/${userId}/orders`)
  return response.data.data ?? response.data
}

// ─────────────────────────────────────────────
// 6. Commandes de l'utilisateur connecté
// ─────────────────────────────────────────────

// Récupérer l'historique des commandes de l'utilisateur connecté
export async function getUserOrders() {
  const response = await api.get('/user/orders')
  return response.data.data ?? response.data
}

// Passer une nouvelle commande depuis le panier
export async function createOrder(payload) {
  const response = await api.post('/user/orders', payload)
  return response.data.data ?? response.data
}

// ─────────────────────────────────────────────
// 7. Authentification & Vérification e-mail
// ─────────────────────────────────────────────

// Vérifier le code à 6 chiffres reçu par e-mail après l'inscription
export async function verifyEmail(email, code) {
  const response = await api.post('/email/verify', { email, code })
  return response.data
}

// Renvoyer un nouveau code de vérification e-mail
export async function resendVerificationCode(email) {
  const response = await api.post('/email/resend', { email })
  return response.data
}

// Demander un code de réinitialisation de mot de passe par e-mail
export async function forgotPassword(email) {
  const response = await api.post('/password/forgot', { email })
  return response.data
}

// Réinitialiser le mot de passe avec le code reçu par e-mail
export async function resetPassword(email, code, password, password_confirmation) {
  const response = await api.post('/password/reset', { email, code, password, password_confirmation })
  return response.data
}

export default api
