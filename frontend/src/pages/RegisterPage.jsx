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

  function handleSubmit(e) {
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
    register(name.trim(), email.trim(), password)
      .then(() => {
        toast.success('Compte créé. Bienvenue !')
        navigate('/')
      })
      .catch((err) => {
        const errors = err.response?.data?.errors
        const msg = errors?.email?.[0] || errors?.password?.[0] || errors?.name?.[0] || err.response?.data?.message || 'Erreur lors de l\'inscription.'
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }

  const inputClass = "w-full py-3 px-4 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-150"

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 sm:p-8 shadow-card">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Inscription</h1>
          <p className="text-slate-600 text-sm mb-6">Créez votre compte Tech Store.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1.5 block">Nom</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" autoComplete="name" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1.5 block">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1.5 block">Mot de passe</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (min. 8 caractères)" autoComplete="new-password" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1.5 block">Confirmation du mot de passe</span>
              <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" autoComplete="new-password" className={inputClass} />
            </label>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 touch-target">
              {loading ? 'Inscription…' : 'S\'inscrire'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-600 text-sm">
            Déjà un compte ? <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
