/**
 * Dashboard Admin – BTS SIO
 * Cartes colorées : utilisateurs, produits, commandes, chiffre d'affaires.
 */
import { useState, useEffect } from 'react'
import api from '../services/api'

// Palette cohérente : accent #FFC43F (identique au site public)
const CARD_STYLES = [
  { bg: 'bg-white dark:bg-[#FFC43F]/15', border: 'border-[#FFC43F]/40', text: 'text-[#FFC43F]', label: 'Utilisateurs' },
  { bg: 'bg-white dark:bg-[#FFC43F]/15', border: 'border-[#FFC43F]/40', text: 'text-[#FFC43F]', label: 'Produits' },
  { bg: 'bg-white dark:bg-[#FFC43F]/15', border: 'border-[#FFC43F]/40', text: 'text-[#FFC43F]', label: 'Commandes' },
  { bg: 'bg-white dark:bg-[#FFC43F]/15', border: 'border-[#FFC43F]/40', text: 'text-[#FFC43F]', label: 'Chiffre d\'affaires' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Erreur chargement stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#FFC43F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-400">
        {error}
      </div>
    )
  }

  const values = [
    stats.total_users,
    stats.total_products,
    stats.total_orders,
    stats.total_revenue.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }),
  ]

  return (
    <div>
      <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 dark:text-white mb-6 sm:mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CARD_STYLES.map((style, i) => (
          <div
            key={style.label}
            className={`rounded-2xl p-5 sm:p-6 border ${style.bg} ${style.border} shadow-sm dark:shadow-card`}
          >
            <p className="text-gray-600 dark:text-tech-muted text-sm mb-2">{style.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${style.text}`}>{values[i]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
