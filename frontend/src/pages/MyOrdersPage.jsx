import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserOrders } from '../services/api'
import toast from 'react-hot-toast'

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function formatDate(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`
}

function getStatusColor(status) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered' || s === 'livré') return 'text-green-600'
  if (s === 'shipped' || s === 'expédié') return 'text-primary'
  if (s === 'cancelled' || s === 'annulé') return 'text-red-600'
  return 'text-amber-600'
}

function getStatusLabel(status) {
  const labels = { pending: 'En attente', processing: 'En cours', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mes commandes</h1>
        <Link
          to="/mon-compte"
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 hover:border-primary/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mon compte
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-16 sm:py-20">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-8 sm:p-12 text-center shadow-card">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-slate-600">Vous n'avez pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-slate-50 border border-slate-300 rounded-xl p-5 sm:p-6 shadow-card transition-shadow duration-150">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <p className="text-slate-500 text-sm">Date</p>
                    <p className="text-slate-900 font-medium">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Commande</p>
                    <p className="text-primary font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Statut</p>
                    <p className={`font-medium ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Total</p>
                    <p className="text-slate-900 font-semibold">
                      {Number(order.total).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setDetailOrder(detailOrder?.id === order.id ? null : order)} className="py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors duration-150 touch-target">
                  {detailOrder?.id === order.id ? 'Masquer' : 'Voir le détail'}
                </button>
              </div>
              {detailOrder?.id === order.id && (
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
                  {order.shipping_address && (
                    <div>
                      <p className="text-slate-500 text-sm mb-1">Adresse de livraison</p>
                      <p className="text-slate-900 text-sm whitespace-pre-wrap rounded-lg bg-slate-50 p-3">{order.shipping_address}</p>
                    </div>
                  )}
                  {order.items?.length > 0 ? (
                    <>
                      <p className="text-slate-500 text-sm mb-2">Produits commandés</p>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 sm:gap-4 py-2 px-3 sm:px-4 rounded-lg bg-slate-50">
                            {item.product?.image_url ? (
                              <img src={item.product.image_url} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 text-xs shrink-0">—</div>
                            )}
                            <span className="flex-1 text-slate-900 font-medium min-w-0 truncate">{item.product?.name ?? 'Produit'}</span>
                            <span className="text-slate-600 text-sm shrink-0">{Number(item.unit_price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                            <span className="text-primary font-medium shrink-0">× {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm">Aucun détail produit pour cette commande.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
