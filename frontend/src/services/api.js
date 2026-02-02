/**
 * Service API – BTS SIO
 * Configuration axios et fonctions pour appeler l'API Laravel.
 * Base URL : à adapter selon l'environnement (dev = Laravel sur :8000).
 */
import axios from 'axios'

// URL de base de l'API Laravel (WAMP + php artisan serve sur :8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

/**
 * Récupère une page de produits depuis l'API (pagination 12 par page).
 * Réponse Laravel : { data: [...], meta: { current_page, last_page, per_page, total }, links: { prev, next } }
 * @param {number} page - Numéro de page (1-based)
 * @param {Object} filters - { search?: string, category_id?: number|string }
 * @returns {Promise<Object>} { data, meta, links }
 */
export async function getProducts(page = 1, filters = {}) {
  const params = { page }
  if (filters.search?.trim()) params.search = filters.search.trim()
  if (filters.category_id) params.category_id = filters.category_id
  const response = await api.get('/products', { params })
  return response.data
}

/**
 * Récupère un produit par son id.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function getProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data.data ?? response.data
}

/**
 * Récupère la liste des catégories depuis l'API (pour le filtre).
 * Réponse Laravel : { data: [ { id, name, slug, ... } ] }
 * @returns {Promise<Array>} Liste des catégories
 */
export async function getCategories() {
  const response = await api.get('/categories')
  return response.data.data ?? response.data
}

/**
 * Récupère tous les produits pour l'admin (sans pagination, tous statuts).
 * @returns {Promise<Array>} Liste des produits
 */
export async function getAdminProducts() {
  const response = await api.get('/products', {
    params: { per_page: 500, active: 0 },
  })
  return response.data.data ?? response.data
}

/**
 * Crée un produit (FormData pour upload image).
 * @param {FormData} formData - category_id, name, slug?, description?, price, stock, image?, is_active?
 */
export async function createProduct(formData) {
  const response = await api.post('/products', formData)
  return response.data.data ?? response.data
}

/**
 * Met à jour un produit (FormData pour upload image).
 * @param {number} id - ID du produit
 * @param {FormData} formData - champs à mettre à jour
 */
export async function updateProduct(id, formData) {
  const response = await api.put(`/products/${id}`, formData)
  return response.data.data ?? response.data
}

/**
 * Supprime un produit.
 */
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}

/**
 * Récupère toutes les commandes (admin).
 * @returns {Promise<Array>}
 */
export async function getAdminOrders() {
  const response = await api.get('/admin/orders')
  return response.data.data ?? response.data
}

/**
 * Met à jour le statut d'une commande.
 * @param {number} orderId
 * @param {string} status
 */
export async function updateOrderStatus(orderId, status) {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status })
  return response.data.order ?? response.data
}

export default api
