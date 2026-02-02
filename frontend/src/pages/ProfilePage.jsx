/**
 * Page Mon Compte – BTS SIO
 * Deux sections : Mes Informations (nom, email) et Sécurité (changement mot de passe).
 * Design sombre/néon, toasts pour succès et erreurs.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

/**
 * Extrait le premier message d'erreur de la réponse Laravel (validation).
 */
function getErrorMessage(err, field) {
  const errors = err.response?.data?.errors
  if (errors?.[field]?.[0]) return errors[field][0]
  // Premier champ en erreur si field non spécifié
  if (errors && typeof errors === 'object') {
    const firstKey = Object.keys(errors)[0]
    if (firstKey && errors[firstKey]?.[0]) return errors[firstKey][0]
  }
  return err.response?.data?.message || 'Une erreur est survenue.'
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth()
  const navigate = useNavigate()

  // Formulaire Infos
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Formulaire Sécurité
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  // Pré-remplir les champs quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])

  // Redirection si non connecté
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error('Veuillez remplir tous les champs.')
      return
    }
    setSavingProfile(true)
    try {
      const response = await api.put('/user/profile', { name: name.trim(), email: email.trim() })
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
        <div className="w-10 h-10 border-2 border-tech-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-2xl font-bold text-white">Mon Compte</h1>

      {/* Section Mes Informations */}
      <section className="bg-tech-card border border-tech-border rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tech-accent" />
          Mes Informations
        </h2>
        <p className="text-tech-muted text-sm mb-6">
          Modifiez votre nom et votre adresse email.
        </p>
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-300 mb-1.5 block">Nom</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
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
          <button
            type="submit"
            disabled={savingProfile}
            className="py-2.5 px-5 rounded-xl bg-tech-accent text-tech-dark font-semibold hover:bg-tech-accent-hover focus:ring-2 focus:ring-tech-accent focus:ring-offset-2 focus:ring-offset-tech-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {savingProfile ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </form>
      </section>

      {/* Section Sécurité */}
      <section className="bg-tech-card border border-tech-border rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tech-accent" />
          Sécurité
        </h2>
        <p className="text-tech-muted text-sm mb-6">
          Changez votre mot de passe. Minimum 8 caractères.
        </p>
        <form onSubmit={handleChangePassword} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-gray-300 mb-1.5 block">Mot de passe actuel</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-300 mb-1.5 block">Nouveau mot de passe</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-300 mb-1.5 block">Confirmer le nouveau mot de passe</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full py-2.5 px-4 rounded-xl bg-tech-dark border border-tech-border text-gray-100 placeholder-tech-muted focus:outline-none focus:ring-2 focus:ring-tech-accent focus:border-transparent transition-colors"
            />
          </label>
          <button
            type="submit"
            disabled={savingPassword}
            className="py-2.5 px-5 rounded-xl bg-tech-accent text-tech-dark font-semibold hover:bg-tech-accent-hover focus:ring-2 focus:ring-tech-accent focus:ring-offset-2 focus:ring-offset-tech-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {savingPassword ? 'Changement…' : 'Changer le mot de passe'}
          </button>
        </form>
      </section>
    </div>
  )
}
