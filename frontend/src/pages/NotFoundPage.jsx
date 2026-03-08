// Page 404 - BTS SIO
// Si l URL existe pas on affiche ce message et un lien accueil
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <p className="text-4xl sm:text-6xl font-heading font-bold text-[#FFC43F] mb-2" aria-hidden>404</p>
      <h1 className="page-title mb-2">Page non trouvée</h1>
      <p className="page-subtitle text-center mb-6 max-w-md">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary inline-block">
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
