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
    try {
      setLoading(true)
      const response = await getAdminUsers()
      setUsers(Array.isArray(response) ? response : [])
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openAddModal = () => {
    setEditingUser(null)
    setForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'client',
      is_admin: false,
    })
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
      is_admin: user.is_admin,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingUser) {
        await updateUserAdmin(editingUser.id, form)
        toast.success('Utilisateur mis à jour')
      } else {
        await createUser(form)
        toast.success('Utilisateur créé')
      }
      closeModal()
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!confirm(`Supprimer l'utilisateur ${user.name} ?`)) return

    try {
      await deleteUserAdmin(user.id)
      toast.success('Utilisateur supprimé')
      fetchUsers()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Utilisateurs</h1>
          <button
            onClick={openAddModal}
            className="py-2.5 px-5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Ajouter un utilisateur
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Chargement...</div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{u.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          u.is_admin ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.is_admin ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                        >
                          Éditer
                        </button>
                        <button
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
                          required
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
                          required
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
    </div>
  )
}
