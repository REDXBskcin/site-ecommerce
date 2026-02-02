/**
 * Page Admin Produits – BTS SIO
 * Tableau des produits avec Ajouter, Éditer, Supprimer.
 * Modal pour le formulaire avec upload d'image.
 */
import { useState, useEffect } from 'react'
import { getAdminProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/api'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '0',
    image: null,
    is_active: true,
  })
  const [imagePreview, setImagePreview] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getAdminProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur chargement produits')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const resetForm = () => {
    setForm({
      category_id: categories[0]?.id ?? '',
      name: '',
      slug: '',
      description: '',
      price: '',
      stock: '0',
      image: null,
      is_active: true,
    })
    setImagePreview(null)
    setEditingProduct(null)
  }

  const openAddModal = () => {
    resetForm()
    if (categories.length) setForm((f) => ({ ...f, category_id: String(categories[0].id) }))
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setForm({
      category_id: String(product.category_id),
      name: product.name,
      slug: product.slug || '',
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock ?? 0),
      image: null,
      is_active: product.is_active ?? true,
    })
    setImagePreview(product.image_url || null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm((f) => ({ ...f, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.category_id || form.price === '' || form.stock === '') {
      toast.error('Veuillez remplir les champs obligatoires.')
      return
    }
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('category_id', form.category_id)
      formData.append('name', form.name.trim())
      if (form.slug?.trim()) formData.append('slug', form.slug.trim())
      if (form.description?.trim()) formData.append('description', form.description.trim())
      formData.append('price', form.price)
      formData.append('stock', form.stock)
      formData.append('is_active', form.is_active ? '1' : '0')
      if (form.image) formData.append('image', form.image)

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
        toast.success('Produit mis à jour.')
      } else {
        await createProduct(formData)
        toast.success('Produit créé.')
      }
      closeModal()
      fetchProducts()
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

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer le produit "${product.name}" ?`)) return
    try {
      await deleteProduct(product.id)
      toast.success('Produit supprimé.')
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
    }
  }

  const getImageUrl = (product) => product.image_url || null

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Produits</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="py-2.5 px-5 rounded-xl bg-tech-accent text-tech-dark font-semibold hover:bg-tech-accent-hover transition-colors"
        >
          Ajouter un produit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-tech-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-tech-card border border-tech-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-tech-border">
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">ID</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Image</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Nom</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Prix</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Stock</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-tech-border last:border-0">
                    <td className="py-3 px-4 text-gray-300">{product.id}</td>
                    <td className="py-3 px-4">
                      {getImageUrl(product) ? (
                        <img
                          src={getImageUrl(product)}
                          alt=""
                          className="w-12 h-12 object-cover rounded-lg bg-tech-dark"
                        />
                      ) : (
                        <span className="text-tech-muted text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-tech-accent">
                      {Number(product.price).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{product.stock}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="py-1.5 px-3 rounded-lg border border-tech-border hover:bg-tech-border hover:text-white transition-colors text-sm"
                      >
                        Éditer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
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
          {products.length === 0 && (
            <p className="py-12 text-center text-tech-muted">Aucun produit.</p>
          )}
        </div>
      )}

      {/* Modal formulaire */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-tech-card border border-tech-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Catégorie *</span>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-tech-accent"
                  >
                    <option value="">— Sélectionner —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Nom *</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nom du produit"
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Slug (optionnel)</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="slug-produit"
                    className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Prix (€) *</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-tech-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Stock *</span>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    required
                    className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-tech-accent"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Description..."
                    rows={3}
                    className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent resize-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-300 mb-1.5 block">Image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="w-full py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-tech-accent file:text-tech-dark file:font-medium"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="mt-2 w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="rounded border-tech-border"
                  />
                  <span className="text-sm text-gray-300">Produit actif</span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-5 rounded-xl bg-tech-accent text-tech-dark font-semibold hover:bg-tech-accent-hover disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="py-2.5 px-5 rounded-xl border border-tech-border hover:bg-tech-border transition-colors"
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
