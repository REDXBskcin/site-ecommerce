// Page Liste de souhaits - BTS SIO
// Pour l instant juste une page vide avec un message
import { Link } from 'react-router-dom'

export default function WishlistPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <p className="text-4xl sm:text-5xl mb-4" aria-hidden>❤️</p>
      <h1 className="page-title mb-2">Liste de souhaits</h1>
      <p className="page-subtitle text-center mb-6 max-w-sm">
        Votre liste de souhaits est vide. Ajoutez des produits depuis la boutique.
      </p>
      <Link to="/" className="btn-primary inline-block">
        Voir la boutique
      </Link>
    </div>
  )
}
