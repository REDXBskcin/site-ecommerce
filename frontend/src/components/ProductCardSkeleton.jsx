/**
 * Skeleton de carte produit – BTS SIO
 * Même structure et classes que ProductCard, avec des blocs gris animés (pulse) pour le chargement.
 */
export default function ProductCardSkeleton() {
  return (
    <article
      className="card-page rounded-2xl overflow-hidden flex flex-col p-4"
      aria-hidden
    >
      <div className="relative block aspect-[4/3] bg-[#F9F9F9] dark:bg-gray-700 rounded-xl overflow-hidden animate-pulse">
        <div className="w-full h-full bg-gray-200 dark:bg-gray-600/80" />
      </div>

      <div className="pt-4 flex flex-col flex-1">
        {/* Catégorie (optionnel) */}
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse" />

        {/* Titre : 2 lignes */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse" />
        </div>

        {/* Prix */}
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded mt-auto mb-3 animate-pulse" />

        {/* Bouton */}
        <div className="w-full h-10 rounded-xl bg-gray-200 dark:bg-gray-600 animate-pulse" />
      </div>
    </article>
  )
}
