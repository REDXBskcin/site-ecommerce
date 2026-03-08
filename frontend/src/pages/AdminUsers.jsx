/**
 * Page Admin Utilisateurs – BTS SIO
 * CRUD : Ajouter, Modifier, Supprimer. Voir les commandes d'un utilisateur.
 */
import { useState, useEffect } from 'react'
import {
  getAdminUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminUserOrders,
} from '../services/api'
import toast from 'react-hot-toast'

function formatDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Aligné avec le backend (Order::STATUSES)
const STATUS_LABELS = {
  pending: 'En attente',
  processing: 'En cours',
  delivered: 'Livré',
  cancelled: 'Annulé',
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | 'orders' | null
  const [editingUser, setEditingUser] = useState(null)
  const [ordersUser, setOrdersUser] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    is_admin: false,
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAdminUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur chargement utilisateurs')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openAddModal = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      is_admin: false,
    })
    setModalMode('add')
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      is_admin: user.is_admin ?? false,
    })
    setModalMode('edit')
  }

  const openOrdersModal = async (user) => {
    setOrdersUser(user)
    setModalMode('orders')
    setOrdersLoading(true)
    try {
      const data = await getAdminUserOrders(user.id)
      setUserOrders(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Erreur chargement des commandes')
      setUserOrders([])
    } finally {
      setOrdersLoading(false)
    }
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingUser(null)
    setOrdersUser(null)
    setUserOrders([])
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (form.password !== form.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    setSaving(true)
    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
        is_admin: form.is_admin,
      })
      toast.success('Utilisateur créé.')
      closeModal()
      fetchUsers()
    } catch (err) {
      const msg =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : err.response?.data?.message || 'Erreur lors de la création.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nom et email requis.')
      return
    }
    setSaving(true)
    try {
      await updateUser(editingUser.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        is_admin: form.is_admin,
      })
      toast.success('Utilisateur mis à jour.')
      closeModal()
      fetchUsers()
    } catch (err) {
      const msg =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : err.response?.data?.message || 'Erreur lors de la modification.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer l'utilisateur "${user.name}" (${user.email}) ? Cette action est irréversible.`)) return
    try {
      await deleteUser(user.id)
      toast.success('Utilisateur supprimé.')
      closeModal()
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">Utilisateurs</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-5 rounded-xl bg-[#FFC43F] text-[#222222] font-semibold hover:bg-[#f7a422] transition-colors duration-200"
        >
          Ajouter un utilisateur
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[#FFC43F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-tech-border">
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">ID</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Nom</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Email</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Admin</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Inscription</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 dark:border-tech-border last:border-0">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.id}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-tech-muted">{user.email}</td>
                    <td className="py-3 px-4">
                      {user.is_admin ? (
                        <span className="text-[#FFC43F] text-sm font-medium">Oui</span>
                      ) : (
                        <span className="text-gray-500 dark:text-tech-muted text-sm">Non</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4 flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => openOrdersModal(user)}
                        className="py-1.5 px-3 rounded-lg border border-gray-300 dark:border-tech-border hover:bg-gray-100 dark:hover:bg-tech-border hover:text-[#FFC43F] transition-colors text-sm text-gray-700 dark:text-gray-200"
                      >
                        Commandes
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="py-1.5 px-3 rounded-lg border border-gray-300 dark:border-tech-border hover:bg-gray-100 dark:hover:bg-tech-border hover:text-[#FFC43F] transition-colors text-sm text-gray-700 dark:text-gray-200"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="py-1.5 px-3 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <p className="py-12 text-center text-gray-500 dark:text-tech-muted">Aucun utilisateur.</p>
          )}
        </div>
      )}

      {/* Modal Ajouter */}
      {modalMode === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ajouter un utilisateur</h2>
              <form onSubmit={handleSubmitAdd} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">Nom *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">Email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">Mot de passe *</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">Confirmer le mot de passe *</span>
                  <input
                    type="password"
                    value={form.password_confirmation}
                    onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_admin}
                    onChange={(e) => setForm((f) => ({ ...f, is_admin: e.target.checked }))}
                    className="rounded border-tech-border"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Administrateur</span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-5 rounded-xl bg-[#FFC43F] text-[#222222] font-semibold hover:bg-[#f7a422] disabled:opacity-50"
                  >
                    {saving ? 'Création…' : 'Créer'}
                  </button>
                  <button type="button" onClick={closeModal} className="py-2.5 px-5 rounded-xl border border-gray-300 dark:border-tech-border hover:bg-gray-100 dark:hover:bg-tech-border text-gray-700 dark:text-gray-200">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {modalMode === 'edit' && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Modifier l'utilisateur</h2>
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">Nom *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">Email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_admin}
                    onChange={(e) => setForm((f) => ({ ...f, is_admin: e.target.checked }))}
                    className="rounded border-tech-border"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Administrateur</span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-5 rounded-xl bg-[#FFC43F] text-[#222222] font-semibold hover:bg-[#f7a422] disabled:opacity-50"
                  >
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button type="button" onClick={closeModal} className="py-2.5 px-5 rounded-xl border border-gray-300 dark:border-tech-border hover:bg-gray-100 dark:hover:bg-tech-border text-gray-700 dark:text-gray-200">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Commandes */}
      {modalMode === 'orders' && ordersUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-tech-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Commandes de {ordersUser.name}
              </h2>
              <button type="button" onClick={closeModal} className="text-gray-500 dark:text-tech-muted hover:text-gray-900 dark:hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#FFC43F] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : userOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-tech-muted text-center py-8">Aucune commande.</p>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="rounded-xl bg-gray-50 dark:bg-tech-dark p-4 border border-gray-200 dark:border-tech-border">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[#FFC43F] font-medium">#{order.id}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {Number(order.total).toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                      </div>
                      {order.items?.length > 0 && (
                        <ul className="text-sm text-gray-500 dark:text-tech-muted space-y-1">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.product?.name ?? 'Produit'} × {item.quantity} —{' '}
                              {Number(item.unit_price).toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
