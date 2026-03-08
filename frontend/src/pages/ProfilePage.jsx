/**
 * Page Mon Compte – BTS SIO
 * Style type Amazon : grille de cartes avec icônes.
 * Mes commandes, Connexion & sécurité, Adresses, Mot de passe.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

function getErrorMessage(err, field) {
  const errors = err.response?.data?.errors
  if (errors?.[field]?.[0]) return errors[field][0]
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0]
    if (firstKey && errors[firstKey]?.[0]) return errors[firstKey][0]
  }
  return err.response?.data?.message || 'Une erreur est survenue.'
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
      setPhone(user.phone ?? '')
      setAddress(user.address ?? '')
      setCity(user.city ?? '')
      setPostalCode(user.postal_code ?? '')
      setCountry(user.country ?? '')
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  const handleSaveInfos = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error('Veuillez remplir le nom et l\'email.')
      return
    }
    setSavingProfile(true)
    try {
      const response = await api.put('/user/profile', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        postal_code: postalCode.trim() || null,
        country: country.trim() || null,
      })
      const updatedUser = response.data?.user ?? response.data
      if (updatedUser) updateUser(updatedUser)
      toast.success('Profil mis à jour.')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
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
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setSavingPassword(true)
    try {
      await api.put('/user/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      toast.success('Mot de passe mis à jour.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(getErrorMessage(err, 'current_password') || getErrorMessage(err))
    } finally {
      setSavingPassword(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#FFC43F] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const inputClass = 'w-full py-2.5 px-4 rounded-lg bg-gray-50 dark:bg-tech-dark border border-gray-200 dark:border-tech-border text-[#222222] dark:text-gray-100 placeholder-gray-400 dark:placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-[#FFC43F] transition-colors'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[60vh]">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#222222] dark:text-white mb-8">
        Votre compte
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Vos commandes */}
        <Link
          to="/my-orders"
          className="flex items-start gap-4 p-5 sm:p-6 bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-xl hover:shadow-md transition-shadow group"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFC43F] flex items-center justify-center text-[#222222]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m0 0l8-4 8 4m0-6v12l-8 4m0 0l-8-4m8 4V4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-bold text-[#222222] dark:text-white text-base group-hover:text-[#FFC43F] transition-colors">
              Vos commandes
            </h2>
            <p className="text-sm text-gray-600 dark:text-tech-muted mt-0.5">
              Suivre, retourner ou acheter à nouveau
            </p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Connexion & sécurité */}
        <div className="flex flex-col p-5 sm:p-6 bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFC43F] flex items-center justify-center text-[#222222]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-[#222222] dark:text-white text-base">
                Connexion & sécurité
              </h2>
              <p className="text-sm text-gray-600 dark:text-tech-muted mt-0.5">
                Modifier l'adresse e-mail, le nom et le numéro de téléphone
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveInfos} className="space-y-4 mt-2">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className={inputClass} required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} required />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" className={inputClass} />
            <button type="submit" disabled={savingProfile} className="btn-primary text-sm py-2 px-4">
              {savingProfile ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
          </form>
        </div>

        {/* Adresses */}
        <div className="flex flex-col p-5 sm:p-6 bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFC43F] flex items-center justify-center text-[#222222]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-[#222222] dark:text-white text-base">
                Adresses
              </h2>
              <p className="text-sm text-gray-600 dark:text-tech-muted mt-0.5">
                Modifier les adresses et les préférences de livraison
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveInfos} className="space-y-4 mt-2">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ville" className={inputClass} />
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Code postal" className={inputClass} />
            </div>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Pays" className={inputClass} />
            <button type="submit" disabled={savingProfile} className="btn-primary text-sm py-2 px-4">
              {savingProfile ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
          </form>
        </div>

        {/* Mot de passe */}
        <div className="flex flex-col p-5 sm:p-6 bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-xl md:col-span-2 lg:col-span-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFC43F] flex items-center justify-center text-[#222222]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-[#222222] dark:text-white text-base">
                Mot de passe
              </h2>
              <p className="text-sm text-gray-600 dark:text-tech-muted mt-0.5">
                Changer votre mot de passe (min. 8 caractères)
              </p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mot de passe actuel" className={inputClass} />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" className={inputClass} />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer" className={inputClass} />
            <button type="submit" disabled={savingPassword} className="btn-primary text-sm py-2 px-4">
              {savingPassword ? 'Changement…' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>

        {/* Nous contacter */}
        <a
          href="mailto:support@techstore.fr"
          className="flex items-start gap-4 p-5 sm:p-6 bg-white dark:bg-tech-card border border-gray-200 dark:border-tech-border rounded-xl hover:shadow-md transition-shadow group"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFC43F] flex items-center justify-center text-[#222222]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-bold text-[#222222] dark:text-white text-base group-hover:text-[#FFC43F] transition-colors">
              Nous contacter
            </h2>
            <p className="text-sm text-gray-600 dark:text-tech-muted mt-0.5">
              Contacter notre service client par e-mail
            </p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}
