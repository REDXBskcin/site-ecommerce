import { useState, useEffect } from 'react'
import { getAdminOrders, getAdminOrderById, updateOrderStatus } from '../services/api'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
]

function formatDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getAdminOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur chargement commandes')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const updated = await updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status ?? newStatus } : o))
      )
      if (detailOrder?.id === orderId) {
        setDetailOrder((d) => (d ? { ...d, status: updated.status ?? newStatus } : null))
      }
      toast.success('Statut mis à jour.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally {
      setUpdatingId(null)
    }
  }

  const openDetail = async (order) => {
    setDetailOrder(order)
    setDetailLoading(true)
    try {
      const full = await getAdminOrderById(order.id)
      setDetailOrder(full)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur chargement détail')
      setDetailOrder(null)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Commandes</h1>

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
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Client</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Total</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Date</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Statut</th>
                  <th className="py-3 px-4 text-slate-600 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-600">#{order.id}</td>
                    <td className="py-3 px-4 text-slate-900 font-medium">
                      {order.user?.name ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-primary font-medium">
                      {Number(order.total).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                          {!STATUS_OPTIONS.some((o) => o.value === order.status) && (
                            <option value={order.status}>{order.status}</option>
                          )}
                        </select>
                        {updatingId === order.id && (
                          <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => openDetail(order)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
                      >
                        Détail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="py-12 text-center text-slate-500">Aucune commande.</p>
          )}
        </div>
      )}

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setDetailOrder(null)}>
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Commande #{detailOrder.id}</h2>
                <button type="button" onClick={() => setDetailOrder(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {detailLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Client</span>
                    <span className="text-slate-900 font-medium">{detailOrder.user?.name ?? '—'}</span>
                    <span className="text-slate-500">Email</span>
                    <span className="text-slate-900">{detailOrder.user?.email ?? '—'}</span>
                    <span className="text-slate-500">Total</span>
                    <span className="text-primary font-semibold">
                      {Number(detailOrder.total).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                    <span className="text-slate-500">Date</span>
                    <span className="text-slate-900">{formatDate(detailOrder.created_at)}</span>
                    <span className="text-slate-500">Statut</span>
                    <span className="text-slate-900">{detailOrder.status}</span>
                  </div>
                  {detailOrder.shipping_address && (
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Adresse de livraison</p>
                      <p className="text-slate-900 text-sm whitespace-pre-wrap rounded-lg bg-slate-50 p-3">{detailOrder.shipping_address}</p>
                    </div>
                  )}
                  {detailOrder.items?.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-sm mb-2">Produits</p>
                      <div className="space-y-2">
                        {detailOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-50">
                            {item.product?.image_url ? (
                              <img src={item.product.image_url} alt="" className="w-10 h-10 object-cover rounded shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-slate-200 shrink-0" />
                            )}
                            <span className="flex-1 text-slate-900 text-sm font-medium truncate">{item.product?.name ?? 'Produit'}</span>
                            <span className="text-slate-600 text-sm">{Number(item.unit_price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
