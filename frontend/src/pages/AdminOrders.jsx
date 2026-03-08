/**
 * Page Admin Commandes – BTS SIO
 * Tableau : ID, Client, Total, Statut. Filtre En cours / Livrées. Select pour modifier le statut.
 */
import { useState, useEffect } from 'react'
import { getAdminOrders, updateOrderStatus } from '../services/api'
import toast from 'react-hot-toast'

// Aligné avec le backend (Order::STATUSES)
const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
]

const FILTER_OPTIONS = [
  { value: '', label: 'Toutes' },
  { value: 'processing', label: 'En cours' },
  { value: 'delivered', label: 'Livrées' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getAdminOrders(statusFilter || undefined)
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
  }, [statusFilter])

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">Commandes</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-4 rounded-xl bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F]"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Client</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Total</th>
                  <th className="py-3 px-4 text-gray-600 dark:text-tech-muted font-medium text-sm">Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-tech-border last:border-0">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">#{order.id}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {order.user?.name ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-[#FFC43F] font-medium">
                      {Number(order.total).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFC43F] disabled:opacity-50 text-sm"
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
                        <span className="ml-2 inline-block w-4 h-4 border-2 border-[#FFC43F] border-t-transparent rounded-full animate-spin" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <p className="py-12 text-center text-gray-500 dark:text-tech-muted">Aucune commande.</p>
          )}
        </div>
      )}
    </div>
  )
}
