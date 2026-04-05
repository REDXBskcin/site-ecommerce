import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { verifyEmail, resendVerificationCode } from '../services/api'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  const [email, setEmail] = useState(state?.email ?? '')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputs = useRef([])

  useEffect(() => {
    if (!cooldown) return
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? (clearInterval(id), 0) : c - 1)), 1000)
    return () => clearInterval(id)
  }, [cooldown])

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
    if (code.length < 6) { toast.error('Entrez les 6 chiffres du code.'); return }
    if (!email.trim()) { toast.error('Adresse e-mail manquante.'); return }
    setLoading(true)
    try {
      const data = await verifyEmail(email.trim(), code)
      loginWithToken(data.user, data.token)
      toast.success('E-mail vérifié ! Bienvenue 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code incorrect ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!email.trim()) { toast.error('Entrez votre adresse e-mail.'); return }
    setResending(true)
    try {
      await resendVerificationCode(email.trim())
      toast.success('Nouveau code envoyé !')
      setCooldown(60)
      setDigits(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/60">

          {/* Icône */}
          <div className="flex justify-center mb-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Vérifiez votre e-mail</h1>
          <p className="text-slate-500 text-sm text-center mb-6">
            Un code à 6 chiffres a été envoyé à <strong className="text-slate-700">{email || 'votre adresse e-mail'}</strong>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ e-mail si absent du state */}
            {!state?.email && (
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-1.5 block">Adresse e-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              </label>
            )}

            {/* Saisie du code */}
            <div>
              <span className="text-sm font-medium text-slate-700 mb-3 block text-center">Code de vérification</span>
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
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Vérification…
                </span>
              ) : 'Confirmer le code'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="text-sm text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-opacity"
            >
              {resending ? 'Envoi…' : cooldown > 0 ? `Renvoyer dans ${cooldown}s` : 'Renvoyer le code'}
            </button>
          </div>

          <p className="mt-4 text-center text-slate-500 text-xs">
            Mauvaise adresse ?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Recommencer l'inscription</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
