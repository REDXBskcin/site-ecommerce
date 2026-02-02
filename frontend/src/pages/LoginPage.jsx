/**
 * Page Connexion – BTS SIO
 * Formulaire centré (email, mot de passe). Design sombre/modern.
 * Erreurs affichées via react-hot-toast.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
      toast.success('Connexion réussie.')
      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        'Identifiants incorrects.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-tech-card border border-tech-border rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-tech-muted text-sm mb-6">
            Connectez-vous à votre compte Tech Store.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-300 mb-1.5 block">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300 mb-1.5 block">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-tech-accent text-tech-dark font-semibold hover:bg-tech-accent-hover focus:ring-2 focus:ring-tech-accent focus:ring-offset-2 focus:ring-offset-tech-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="mt-6 text-center text-tech-muted text-sm">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-tech-accent hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
