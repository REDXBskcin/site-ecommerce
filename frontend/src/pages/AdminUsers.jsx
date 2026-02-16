import { useState, useEffect } from 'react'
import { getAdminUsers, createUser, updateUserAdmin, deleteUserAdmin } from '../services/api'
import toast from 'react-hot-toast'

function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'client',
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

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'client',
      is_admin: false,
    })
    setEditingUser(null)
  }

  const openAddModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      password_confirmation: '',
      role: user.role ?? 'client',
      is_admin: user.is_admin ?? false,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nom et email obligatoires.')
      return
    }
    if (!editingUser && (!form.password || form.password.length < 8)) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (!editingUser && form.password !== form.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    setSaving(true)
    try {
      if (editingUser) {
        const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role, is_admin: form.is_admin }
        if (form.password && form.password.length >= 8) {
          payload.password = form.password
          payload.password_confirmation = form.password_confirmation || form.password
        }
        await updateUserAdmin(editingUser.id, payload)
        toast.success('Utilisateur mis à jour.')
      } else {
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role,
          is_admin: form.is_admin,
        })
        toast.success('Utilisateur créé.')
      }
      closeModal()
      fetchUsers()
    } catch (err) {
      const msg =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : err.response?.data?.message || 'Erreur lors de l\'enregistrement.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer l'utilisateur "${user.name}" ?`)) return
    try {
      await deleteUserAdmin(user.id)
      toast.success('Utilisateur supprimé.')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          Ajouter un utilisateur
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">ID</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Nom</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Email</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Rôle</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Admin</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Inscrit le</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-600">{u.id}</td>
                    <td className="py-3 px-4 text-slate-900 font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-slate-600">{u.role ?? '—'}</td>
                    <td className="py-3 px-4">
                      {u.is_admin ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">Oui</span>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">{formatDate(u.created_at)}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                      >
                        Éditer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        className="py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
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
            <p className="py-12 text-center text-slate-500">Aucun utilisateur.</p>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1.5 block">Nom *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Jean Dupont"
                    required
                    className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1.5 block">Email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="jean@exemple.com"
                    required
                    className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                {!editingUser && (
                  <>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700 mb-1.5 block">Mot de passe * (min. 8 caractères)</span>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="••••••••"
                        minLength={8}
                        className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700 mb-1.5 block">Confirmer le mot de passe *</span>
                      <input
                        type="password"
                        value={form.password_confirmation}
                        onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                  </>
                )}
                {editingUser && (
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 mb-1.5 block">Nouveau mot de passe (laisser vide pour ne pas changer)</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                )}
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1.5 block">Rôle</span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_admin}
                    onChange={(e) => setForm((f) => ({ ...f, is_admin: e.target.checked }))}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700">Accès administrateur</span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="py-2.5 px-5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
