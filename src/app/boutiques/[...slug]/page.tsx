import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MapPin, Phone, MessageSquare, Globe, Clock, Star, Heart, Share2, Store } from "lucide-react"
import { PromotionCard } from "@/components/promotions/PromotionCard"
import { formatPrix } from "@/lib/utils"
import { ShopMap } from "@/components/shop/ShopMap"

async function getBoutique(slug: string) {
  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      arrondissement: { select: { id: true, name: true, slug: true } },
      owner: { select: { id: true, firstName: true, lastName: true } },
      promotions: {
        where: { status: "APPROVED" },
        include: { media: { orderBy: { displayOrder: "asc" }, take: 1 } },
        take: 20,
      },
      galleryImages: { orderBy: { displayOrder: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { promotions: true, followers: true, reviews: true } },
    },
  })

  if (!shop) return null

  const avgRating = await prisma.review.aggregate({
    where: { shopId: shop.id, status: "APPROVED" },
    _avg: { rating: true },
  })

  return { ...shop, avgRating: avgRating._avg.rating || 0 }
}

export default async function BoutiqueDetailPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.[0]
  if (!slug) notFound()

  const shop = await getBoutique(slug)
  if (!shop) notFound()

  return (
    <div className="container-congo py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-3xl font-bold text-primary-600">
              {shop.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-dark">{shop.name}</h1>
                {shop.isVerified && <span className="badge-success">Vérifiée</span>}
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {shop.arrondissement?.name || ""}{shop.address ? ` - ${shop.address}` : ""}
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium text-dark">{shop.avgRating.toFixed(1)}</span>
                  <span className="text-gray-500">({shop._count.reviews} avis)</span>
                </div>
                <span className="text-sm text-gray-500">{shop._count.promotions} promotions</span>
                <span className="text-sm text-gray-500">{shop._count.followers} abonnés</span>
              </div>
            </div>
          </div>

          {shop.description && (
            <div className="mt-6">
              <p className="leading-relaxed text-gray-600">{shop.description}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {shop.phone && (
              <a href={`tel:${shop.phone}`} className="btn-primary">
                <Phone className="h-4 w-4" /> Appeler
              </a>
            )}
            {shop.whatsapp && (
              <a href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" className="btn-secondary bg-green-500 text-white border-green-500 hover:bg-green-600">
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </a>
            )}
            <button className="btn-outline">
              <Heart className="h-4 w-4" /> Suivre
            </button>
            <button className="btn-outline">
              <Share2 className="h-4 w-4" /> Partager
            </button>
          </div>

          {shop.promotions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-dark">Promotions de la boutique</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {shop.promotions.map((promo) => (
                  <PromotionCard
                    key={promo.id}
                    id={promo.id}
                    nom={promo.title}
                    slug={promo.slug}
                    prixNormal={promo.oldPrice}
                    prixPromotionnel={promo.newPrice}
                    dateFin={promo.endDate.toISOString()}
                    boutiqueNom={shop.name}
                    ville={shop.arrondissement?.name || ""}
                    imageUrl={promo.media[0]?.fileUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {shop.galleryImages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-dark">Galerie photos</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {shop.galleryImages.map((img) => (
                  <a
                    key={img.id}
                    href={img.url}
                    target="_blank"
                    className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || ""}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white">{img.caption}</p>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {shop.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-dark">Avis clients</h2>
              <div className="mt-4 space-y-4">
                {shop.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                          {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-dark">{review.user.firstName} {review.user.lastName}</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-20 space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-dark">Informations</h3>
              <div className="mt-4 space-y-4">
                {shop.address && (
                  <InfoItem icon={<MapPin className="h-4 w-4" />} label="Adresse" value={shop.address} />
                )}
                {shop.phone && (
                  <InfoItem icon={<Phone className="h-4 w-4" />} label="Téléphone" value={shop.phone} />
                )}
                {shop.whatsapp && (
                  <InfoItem icon={<MessageSquare className="h-4 w-4" />} label="WhatsApp" value={shop.whatsapp} />
                )}
                {shop.email && (
                  <InfoItem icon={<Globe className="h-4 w-4" />} label="Email" value={shop.email} />
                )}
                {shop.openingHours && (
                  <InfoItem icon={<Clock className="h-4 w-4" />} label="Horaires" value="Voir détails" />
                )}
                {shop.category && (
                  <InfoItem icon={<Store className="h-4 w-4" />} label="Catégorie" value={shop.category.name} />
                )}
              </div>
            </div>

            {shop.arrondissement && (
              <div className="card p-5">
                <h3 className="font-semibold text-dark">Localisation</h3>
                <p className="mt-2 text-sm text-gray-600">{shop.arrondissement.name}</p>
                <div className="mt-3">
                  <ShopMap
                    name={shop.name}
                    address={shop.address}
                    slug={shop.slug}
                    latitude={shop.latitude}
                    longitude={shop.longitude}
                  />
                </div>
              </div>
            )}

            {(shop.facebookUrl || shop.instagramUrl || shop.tiktokUrl) && (
              <div className="card p-5">
                <h3 className="font-semibold text-dark">Réseaux sociaux</h3>
                <div className="mt-3 flex gap-2">
                  {shop.facebookUrl && (
                    <a href={shop.facebookUrl} className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                  )}
                  {shop.instagramUrl && (
                    <a href={shop.instagramUrl} className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary-500">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-dark">{value}</p>
      </div>
    </div>
  )
}