/**
 * Page Mes Commandes – BTS SIO
 * Historique des commandes de l'utilisateur connecté.
 */
import { useState, useEffect } from 'react'
import { getUserOrders } from '../services/api'
import toast from 'react-hot-toast'

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

function formatDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`
}

function getStatusColor(status) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered' || s === 'livré') return 'text-green-400'
  if (s === 'shipped' || s === 'expédié') return 'text-amber-400'
  if (s === 'cancelled' || s === 'annulé') return 'text-red-400'
  return 'text-yellow-400' // pending, en attente, etc.
}

function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    shipped: 'Expédié',
    delivered: 'Livré',
    cancelled: 'Annulé',
  }
  return labels[(status || '').toLowerCase()] ?? status
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailOrder, setDetailOrder] = useState(null)

  useEffect(() => {
    getUserOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {
        toast.error('Erreur chargement des commandes')
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="page-title mb-6 sm:mb-8">Mes commandes</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[#FFC43F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-2xl p-12 text-center text-gray-500 dark:text-tech-muted">
          Vous n'avez pas encore passé de commande.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-2xl p-6 shadow-sm dark:shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-gray-500 dark:text-tech-muted text-sm">Date</p>
                    <p className="text-gray-900 dark:text-white font-medium">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-tech-muted text-sm">Commande</p>
                    <p className="text-[#FFC43F] font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-tech-muted text-sm">Statut</p>
                    <p className={`font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-tech-muted text-sm">Total</p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {Number(order.total).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailOrder(detailOrder?.id === order.id ? null : order)}
                  className="py-2 px-4 rounded-xl border border-gray-300 dark:border-tech-border hover:bg-gray-100 dark:hover:bg-tech-border hover:text-[#FFC43F] transition-colors text-sm text-gray-700 dark:text-gray-200"
                >
                  {detailOrder?.id === order.id ? 'Masquer' : 'Voir le détail'}
                </button>
              </div>

              {detailOrder?.id === order.id && order.items?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-tech-border">
                  <p className="text-gray-500 dark:text-tech-muted text-sm mb-4">Produits commandés</p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-2 px-4 rounded-xl bg-gray-50 dark:bg-tech-dark"
                      >
                        {item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-tech-border flex items-center justify-center text-gray-500 dark:text-tech-muted text-xs">
                            —
                          </div>
                        )}
                        <span className="flex-1 text-gray-900 dark:text-white font-medium">
                          {item.product?.name ?? 'Produit'}
                        </span>
                        <span className="text-gray-500 dark:text-tech-muted">
                          {Number(item.unit_price).toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </span>
                        <span className="text-[#FFC43F] font-medium">× {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailOrder?.id === order.id && (!order.items || order.items.length === 0) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-tech-border text-gray-500 dark:text-tech-muted text-sm">
                  Aucun détail disponible pour cette commande.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
