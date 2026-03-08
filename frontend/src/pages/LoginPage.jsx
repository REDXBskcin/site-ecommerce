// Page Connexion - BTS SIO
// Formulaire email + mot de passe, apres connexion on redirige vers la page d avant ou l accueil
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    try {
      await auth.login(email.trim(), password)
      toast.success('Connexion réussie.')
      // on redirige vers la page d ou venait l user ou l accueil
      let pageCible = '/'
      if (location.state && location.state.from && location.state.from.pathname) {
        pageCible = location.state.from.pathname
      }
      navigate(pageCible, { replace: true })
    } catch (err) {
      let msg = 'Identifiants incorrects.'
      if (err.response && err.response.data) {
        if (err.response.data.errors && err.response.data.errors.email) msg = err.response.data.errors.email[0]
        else if (err.response.data.message) msg = err.response.data.message
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="card-page card-page-form animate-slide-up">
          <h1 className="page-title mb-2">Connexion</h1>
          <p className="page-subtitle mb-6">Connectez-vous à votre compte Tech Store.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-[#222222] dark:text-gray-300 mb-1.5 block">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#222222] dark:text-gray-300 mb-1.5 block">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="input-field"
              />
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="mt-6 text-center page-subtitle">
            Pas encore de compte ? <Link to="/register" className="text-[#FFC43F] hover:underline">S&apos;inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
