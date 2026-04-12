import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../services/api'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { toast.error('Veuillez saisir votre adresse e-mail.'); return }
    setLoading(true)
    try {
      await forgotPassword(email.trim())
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/60 dark:shadow-none text-center">
            <div className="flex justify-center mb-5">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">E-mail envoyé</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Si un compte est associé à <strong className="text-slate-700 dark:text-slate-200">{email}</strong>,
              vous recevrez un code à 6 chiffres dans quelques instants.
            </p>
            <button
              type="button"
              onClick={() => navigate('/reset-password', { state: { email } })}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/25 transition-all duration-150"
            >
              Entrer le code reçu →
            </button>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Pas reçu ?{' '}
              <button type="button" onClick={() => setSent(false)} className="text-primary font-medium hover:underline">
                Réessayer
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/60 dark:shadow-none">

          <div className="flex justify-center mb-5">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">Mot de passe oublié ?</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
            Entrez votre adresse e-mail et nous vous enverrons un code à 6 chiffres.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Adresse e-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                autoFocus
                className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi…
                </span>
              ) : 'Envoyer le code'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            <Link to="/login" className="text-primary font-medium hover:underline">← Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
