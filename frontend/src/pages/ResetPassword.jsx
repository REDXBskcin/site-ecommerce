import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/api'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState(state?.email ?? '')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const inputs = useRef([])

  function handleDigit(idx, val) {
    const ch = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = ch
    setDigits(next)
    if (ch && idx < 5) inputs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = text.split('').concat(Array(6).fill('')).slice(0, 6)
    setDigits(next)
    inputs.current[Math.min(text.length, 5)]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (!email.trim()) { toast.error('Adresse e-mail manquante.'); return }
    if (code.length < 6) { toast.error('Entrez les 6 chiffres du code.'); return }
    if (password.length < 8) { toast.error('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (password !== passwordConfirmation) { toast.error('Les mots de passe ne correspondent pas.'); return }

    setLoading(true)
    try {
      await resetPassword(email.trim(), code, password, passwordConfirmation)
      toast.success('Mot de passe réinitialisé ! Vous pouvez vous connecter.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code incorrect ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/60 dark:shadow-none">

          <div className="flex justify-center mb-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">Nouveau mot de passe</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
            Entrez le code reçu par e-mail puis choisissez votre nouveau mot de passe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!state?.email && (
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </label>
            )}

            {/* Saisie du code */}
            <div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block text-center">Code reçu par e-mail</span>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                  />
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Nouveau mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min. 8 caractères)"
                autoComplete="new-password"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Confirmer le mot de passe</span>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
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
                  Réinitialisation…
                </span>
              ) : 'Réinitialiser le mot de passe'}
            </button>
          </form>

          <p className="mt-4 text-center text-slate-500 dark:text-slate-400 text-sm">
            <Link to="/forgot-password" className="text-primary font-medium hover:underline">← Demander un nouveau code</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
