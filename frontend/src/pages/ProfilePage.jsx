import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

function getError(err, champ) {
  const data = err.response && err.response.data
  if (!data) return 'Une erreur est survenue.'
  const errors = data.errors
  if (errors && errors[champ] && errors[champ][0]) return errors[champ][0]
  if (errors && typeof errors === 'object') {
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      const first = errors[keys[0]]
      if (Array.isArray(first) && first[0]) return first[0]
    }
  }
  return data.message || 'Une erreur est survenue.'
}

const inputClass =
  'w-full py-3.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:shadow-md focus:shadow-primary/5 transition-all duration-200'

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSectionOpen, setPasswordSectionOpen] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
      setAddress(user.address ?? '')
      setCity(user.city ?? '')
      setPostalCode(user.postal_code ?? '')
      setCountry(user.country ?? '')
      setPhone(user.phone ?? '')
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login', { replace: true })
  }, [authLoading, isAuthenticated, navigate])

  function handleSaveProfile(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error('Veuillez remplir le nom et l\'e-mail.')
      return
    }
    setSavingProfile(true)
    setProfileSaved(false)
    api
      .put('/user/profile', {
        name: name.trim(),
        email: email.trim(),
        address: address.trim() || null,
        city: city.trim() || null,
        postal_code: postalCode.trim() || null,
        country: country.trim() || null,
        phone: phone.trim() || null,
      })
      .then((response) => {
        const updatedUser = response.data?.user ?? response.data
        if (updatedUser) updateUser(updatedUser)
        setProfileSaved(true)
        toast.success('Profil mis à jour.')
        setTimeout(() => setProfileSaved(false), 2000)
      })
      .catch((err) => toast.error(getError(err)))
      .finally(() => setSavingProfile(false))
  }

  function handleChangePassword(e) {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (!/[a-zA-Z]/.test(newPassword)) {
      toast.error('Le mot de passe doit contenir au moins une lettre.')
      return
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error('Le mot de passe doit contenir au moins un chiffre.')
      return
    }
    if (!/[^a-zA-Z0-9]/.test(newPassword)) {
      toast.error('Le mot de passe doit contenir au moins un caractère spécial (ex: @, #, !, $…).')
      return
    }
    setSavingPassword(true)
    api
      .put('/user/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      .then(() => {
        toast.success('Mot de passe mis à jour.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordSectionOpen(false)
      })
      .catch((err) => toast.error(getError(err, 'current_password') || getError(err)))
      .finally(() => setSavingPassword(false))
  }

  const initial = (user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in">
        <header className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/90 text-xl sm:text-2xl font-bold text-white shadow-lg shadow-primary/30 ring-2 ring-white/50">
                {initial}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Bonjour, {user.name || 'vous'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Gérez vos informations et suivez vos commandes
                </p>
              </div>
            </div>
          </div>
        </header>

      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Accès rapide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/my-orders"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Mes commandes</span>
              <p className="text-slate-500 text-sm mt-0.5">Voir l’historique et le suivi</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 ml-auto shrink-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/"
            className="group flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Boutique</span>
              <p className="text-slate-500 text-sm mt-0.5">Continuer mes achats</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 ml-auto shrink-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
        <div className="flex items-center gap-3 px-6 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Informations personnelles</h2>
            <p className="text-slate-500 text-sm mt-0.5">Nom, e-mail et adresse de livraison</p>
          </div>
        </div>
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Identité</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Nom</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    className={inputClass}
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Adresse e-mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Adresse de livraison</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Adresse</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Numéro et nom de rue"
                    autoComplete="street-address"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Ville</span>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ville"
                    autoComplete="address-level2"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Code postal</span>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Code postal"
                    autoComplete="postal-code"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Pays</span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Pays"
                    autoComplete="country-name"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Téléphone</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-7 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 transition-all duration-200 touch-target"
            >
              {savingProfile ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement…
                </>
              ) : profileSaved ? (
                <>
                  <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistré
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
            {profileSaved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Modifications enregistrées
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setPasswordSectionOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white text-left hover:from-slate-50 hover:to-slate-50/80 transition-colors"
          aria-expanded={passwordSectionOpen}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Sécurité</h2>
              <p className="text-slate-500 text-sm mt-0.5">Changer votre mot de passe</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${passwordSectionOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {passwordSectionOpen && (
          <form onSubmit={handleChangePassword} className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/30">
            <p className="text-slate-600 text-sm mb-6">
              Saisissez votre mot de passe actuel puis le nouveau (minimum 8 caractères).
            </p>
            <div className="space-y-5 max-w-md">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Mot de passe actuel</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Nouveau mot de passe</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass}
                  minLength={8}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Confirmer le nouveau mot de passe</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 py-3.5 px-7 rounded-xl bg-slate-800 text-white font-semibold shadow-md hover:bg-slate-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all duration-200 touch-target"
              >
                {savingPassword ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mise à jour…
                  </>
                ) : (
                  'Changer le mot de passe'
                )}
              </button>
            </div>
          </form>
        )}
      </section>
      </div>
    </div>
  )
}
