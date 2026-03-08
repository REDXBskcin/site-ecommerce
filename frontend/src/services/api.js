// ============================================================
// Service API – BTS SIO
// Tous les appels vers le backend Laravel (URL dans .env ou 127.0.0.1:8000)
// ============================================================
import axios from 'axios'

// URL de base de l'API (variable d'environnement ou valeur par défaut)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Instance axios configurée une fois pour toutes les requêtes
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

// Intercepteur : si le serveur renvoie 401 ou 403, on déconnecte et redirige vers /login
api.interceptors.response.use(
  function (res) {
    return res
  },
  function (err) {
    const status = err.response ? err.response.status : null
    if (status === 401 || status === 403) {
      window.dispatchEvent(new CustomEvent('auth:logout'))
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// --- Produits (catalogue public) ---

// Liste des produits avec pagination (page 1, 2, ...) et filtres optionnels
export async function getProducts(page, filters) {
  if (!page) page = 1
  if (!filters) filters = {}
  const params = { page: page }
  // On ajoute les filtres seulement s'ils sont renseignés
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim()
  }
  if (filters.category_id) {
    params.category_id = filters.category_id
  }
  const response = await api.get('/products', { params })
  return response.data
}

// Récupère un seul produit par son identifiant
export async function getProductById(id) {
  const response = await api.get('/products/' + id)
  const data = response.data
  if (data.data) return data.data
  return data
}

// Liste des catégories (pour le filtre et le menu)
export async function getCategories() {
  const response = await api.get('/categories')
  const data = response.data
  if (data.data) return data.data
  return data
}

// --- Administration : produits paginés ---
export async function getAdminProductsPaginated(page, perPage) {
  if (!page) page = 1
  if (!perPage) perPage = 10
  const response = await api.get('/products', { params: { page, per_page: perPage, active: 0 } })
  return response.data
}

// Créer un produit (admin) - FormData pour l image
export async function createProduct(formData) {
  const response = await api.post('/admin/products', formData)
  const data = response.data
  if (data.data) return data.data
  return data
}

// Mettre à jour un produit (admin)
export async function updateProduct(id, formData) {
  const response = await api.put('/admin/products/' + id, formData)
  const data = response.data
  if (data.data) return data.data
  return data
}

// Supprimer un produit (admin)
export async function deleteProduct(id) {
  await api.delete('/admin/products/' + id)
}

// Liste des commandes (admin), optionnel filtre par statut
export async function getAdminOrders(status) {
  const params = status ? { status: status } : {}
  const response = await api.get('/admin/orders', { params })
  const data = response.data
  if (data.data) return data.data
  return data
}

// Liste des utilisateurs (admin)
export async function getAdminUsers() {
  const response = await api.get('/admin/users')
  const data = response.data
  if (data.data) return data.data
  return data
}

// Créer un utilisateur (admin)
export async function createUser(data) {
  const response = await api.post('/admin/users', data)
  const res = response.data
  if (res.user) return res.user
  return res
}

// Mettre à jour un utilisateur (admin)
export async function updateUser(id, data) {
  const response = await api.put('/admin/users/' + id, data)
  const res = response.data
  if (res.user) return res.user
  return res
}

// Supprimer un utilisateur (admin)
export async function deleteUser(id) {
  await api.delete('/admin/users/' + id)
}

// Commandes d un utilisateur (admin)
export async function getAdminUserOrders(userId) {
  const response = await api.get('/admin/users/' + userId + '/orders')
  const data = response.data
  if (data.data) return data.data
  return data
}

// Changer le statut d une commande (admin)
export async function updateOrderStatus(orderId, status) {
  const response = await api.patch('/admin/orders/' + orderId + '/status', { status: status })
  const data = response.data
  if (data.order) return data.order
  return data
}

// Commandes de l utilisateur connecte
export async function getUserOrders() {
  const response = await api.get('/user/orders')
  const data = response.data
  if (data.data) return data.data
  return data
}

// Passer une commande : items = [{ product_id, quantity }, ...]
export async function createOrder(items, shipping_address) {
  if (!shipping_address) shipping_address = ''
  const response = await api.post('/user/orders', {
    items: items,
    shipping_address: shipping_address,
  })
  const data = response.data
  if (data.data) return data.data
  return data
}

// Export par défaut pour les appels directs (ex: AuthContext)
export default api
