/**
 * Page Admin Commandes – BTS SIO
 * Liste des commandes avec possibilité de changer le statut.
 */
import { useState, useEffect } from 'react'
import { getAdminOrders, updateOrderStatus } from '../services/api'
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
      toast.success('Statut mis à jour.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Commandes</h1>

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
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Client</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Total</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Date</th>
                  <th className="py-3 px-4 text-tech-muted font-medium text-sm">Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-tech-border last:border-0">
                    <td className="py-3 px-4 text-gray-300">#{order.id}</td>
                    <td className="py-3 px-4 text-white font-medium">
                      {order.user?.name ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-tech-accent font-medium">
                      {Number(order.total).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="py-2 px-3 rounded-lg bg-tech-dark border border-tech-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-tech-accent disabled:opacity-50 text-sm"
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
                        <span className="ml-2 inline-block w-4 h-4 border-2 border-tech-accent border-t-transparent rounded-full animate-spin" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="py-12 text-center text-tech-muted">Aucune commande.</p>
          )}
        </div>
      )}
    </div>
  )
}
