// Spinner pour afficher "chargement" - BTS SIO
export default function LoadingSpinner({ className = '', size = 'md', label = 'Chargement…' }) {
  let tailleClasse = 'w-10 h-10 border-2'
  if (size === 'sm') tailleClasse = 'w-6 h-6 border-2'
  if (size === 'lg') tailleClasse = 'w-12 h-12 border-4'

  return (
    <div className={'flex flex-col items-center justify-center gap-3 ' + className}>
      <span
        className={'inline-block ' + tailleClasse + ' border-[#FFC43F] border-t-transparent rounded-full animate-spin'}
        aria-hidden
      />
      {label && <span className="text-sm text-[#787878] dark:text-tech-muted">{label}</span>}
    </div>
  )
}
