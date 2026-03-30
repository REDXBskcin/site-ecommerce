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

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)
    login(email.trim(), password)
      .then(() => {
        toast.success('Connexion réussie.')
        navigate('/')
      })
      .catch((err) => {
        const msg = err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Identifiants incorrects.'
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }

  const inputClass = "w-full py-3 px-4 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow duration-150"

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 sm:p-8 shadow-card">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Connexion</h1>
          <p className="text-slate-600 text-sm mb-6">Connectez-vous à votre compte Tech Store.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1.5 block">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1.5 block">Mot de passe</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className={inputClass} />
            </label>
            <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 touch-target">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-600 text-sm">
            Pas encore de compte ? <Link to="/register" className="text-primary font-medium hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
