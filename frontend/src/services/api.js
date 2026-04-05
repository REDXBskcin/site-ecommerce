import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const STORAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '')

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
  if (url.startsWith('/')) return import.meta.env.DEV ? url : STORAGE_BASE_URL + url
  return import.meta.env.DEV ? '/' + url : STORAGE_BASE_URL + '/' + url
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

export async function getProducts(page = 1, filters = {}) {
  const params = { page }
  if (filters.search?.trim()) params.search = filters.search.trim()
  if (filters.category_id) params.category_id = filters.category_id
  const response = await api.get('/products', { params })
  return response.data
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data.data ?? response.data
}

export async function getCategories() {
  const response = await api.get('/categories')
  return response.data.data ?? response.data
}

export async function getAdminProducts() {
  const response = await api.get('/products', {
    params: { per_page: 500, active: 0 },
  })
  return response.data.data ?? response.data
}

export async function createProduct(formData) {
  const response = await api.post('/admin/products', formData)
  return response.data.data ?? response.data
}

export async function updateProduct(id, formData) {
  formData.append('_method', 'PUT')
  const response = await api.post(`/admin/products/${id}`, formData)
  return response.data.data ?? response.data
}

export async function deleteProduct(id) {
  await api.delete(`/admin/products/${id}`)
}

export async function getAdminOrders() {
  const response = await api.get('/admin/orders')
  return response.data.data ?? response.data
}

export async function getAdminOrderById(orderId) {
  const response = await api.get(`/admin/orders/${orderId}`)
  return response.data.data ?? response.data
}

export async function updateOrderStatus(orderId, status) {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status })
  return response.data.order ?? response.data
}

export async function getAdminUsers() {
  const response = await api.get('/admin/users')
  return response.data.data ?? response.data
}

export async function createUser(payload) {
  const response = await api.post('/admin/users', payload)
  return response.data.user ?? response.data
}

export async function updateUserAdmin(userId, payload) {
  const response = await api.put(`/admin/users/${userId}`, payload)
  return response.data.user ?? response.data
}

export async function deleteUserAdmin(userId) {
  await api.delete(`/admin/users/${userId}`)
}

export async function getAdminUserOrders(userId) {
  const response = await api.get(`/admin/users/${userId}/orders`)
  return response.data.data ?? response.data
}

export async function getUserOrders() {
  const response = await api.get('/user/orders')
  return response.data.data ?? response.data
}

export async function createOrder(payload) {
  const response = await api.post('/user/orders', payload)
  return response.data.data ?? response.data
}

export async function verifyEmail(email, code) {
  const response = await api.post('/email/verify', { email, code })
  return response.data
}

export async function resendVerificationCode(email) {
  const response = await api.post('/email/resend', { email })
  return response.data
}

export async function forgotPassword(email) {
  const response = await api.post('/password/forgot', { email })
  return response.data
}

export async function resetPassword(email, code, password, password_confirmation) {
  const response = await api.post('/password/reset', { email, code, password, password_confirmation })
  return response.data
}

export default api
