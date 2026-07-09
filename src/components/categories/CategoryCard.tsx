import Link from "next/link"

interface CategoryCardProps {
  nom: string
  slug: string
  icone: string
  description?: string
}

export function CategoryCard({ nom, slug, icone, description }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:border-primary-200 hover:shadow-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="mb-3 inline-block text-4xl transition-transform group-hover:scale-110">{icone}</span>
      <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-600">{nom}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </Link>
  )
}
