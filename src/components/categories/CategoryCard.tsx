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
      className="card flex flex-col items-center p-6 text-center transition-all hover:border-primary-200 hover:shadow-md"
    >
      <span className="mb-3 text-4xl">{icone}</span>
      <h3 className="text-sm font-semibold text-dark">{nom}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </Link>
  )
}
