/**
 * Page Inscription – BTS SIO
 * Formulaire centré (nom, email, mot de passe, confirmation). Design sombre/modern.
 * Erreurs affichées via react-hot-toast.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password || !passwordConfirmation) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    if (password !== passwordConfirmation) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      toast.success('Compte créé. Bienvenue !')
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      const msg =
        errors?.email?.[0] ||
        errors?.password?.[0] ||
        errors?.name?.[0] ||
        err.response?.data?.message ||
        'Erreur lors de l\'inscription.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-tech-card border border-tech-border rounded-2xl p-8 shadow-card">
          <h1 className="text-2xl font-bold text-white mb-2">Inscription</h1>
          <p className="text-tech-muted text-sm mb-6">
            Créez votre compte Tech Store.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-300 mb-1.5 block">Nom</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                autoComplete="name"
                className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
              />
            </label>
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
                placeholder="•••••••• (min. 8 caractères)"
                autoComplete="new-password"
                className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300 mb-1.5 block">Confirmation du mot de passe</span>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-tech-accent text-tech-dark font-semibold hover:bg-tech-accent-hover focus:ring-2 focus:ring-tech-accent focus:ring-offset-2 focus:ring-offset-tech-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Inscription…' : 'S\'inscrire'}
            </button>
          </form>
          <p className="mt-6 text-center text-tech-muted text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-tech-accent hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
