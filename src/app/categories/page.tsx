import { CategoryCard } from "@/components/categories/CategoryCard"
import { CATEGORIES } from "@/lib/utils"
import { Tag } from "lucide-react"

export default function CategoriesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-12">
        <div className="container-congo">
          <Tag className="mb-4 h-10 w-10 text-yellow-300" />
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Catégories
          </h1>
          <p className="mt-2 text-white/80">
            Parcourez les promotions par catégorie et trouvez ce que vous cherchez
          </p>
        </div>
      </section>

      <section className="container-congo py-12">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} {...cat} />
          ))}
        </div>
      </section>
    </>
  )
}
