// Page Inscription - BTS SIO
// Formulaire nom, email, mot de passe, confirmation. Redirection apres inscription.
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
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
      await auth.register(name.trim(), email.trim(), password)
      toast.success('Compte créé. Bienvenue !')
      let pageCible = '/'
      if (location.state && location.state.from && location.state.from.pathname) {
        pageCible = location.state.from.pathname
      }
      navigate(pageCible, { replace: true })
    } catch (err) {
      let msg = "Erreur lors de l'inscription."
      if (err.response && err.response.data) {
        const data = err.response.data
        if (data.errors) {
          if (data.errors.email) msg = data.errors.email[0]
          else if (data.errors.password) msg = data.errors.password[0]
          else if (data.errors.name) msg = data.errors.name[0]
        } else if (data.message) msg = data.message
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
          <h1 className="page-title mb-2">Inscription</h1>
          <p className="page-subtitle mb-6">Créez votre compte Tech Store.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-[#222222] dark:text-gray-300 mb-1.5 block">Nom</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" autoComplete="name" className="input-field" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#222222] dark:text-gray-300 mb-1.5 block">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" className="input-field" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#222222] dark:text-gray-300 mb-1.5 block">Mot de passe</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (min. 8 caractères)" autoComplete="new-password" className="input-field" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#222222] dark:text-gray-300 mb-1.5 block">Confirmation du mot de passe</span>
              <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="input-field" />
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Inscription…' : "S'inscrire"}
            </button>
          </form>
          <p className="mt-6 text-center page-subtitle">
            Déjà un compte ? <Link to="/login" className="text-[#FFC43F] hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
