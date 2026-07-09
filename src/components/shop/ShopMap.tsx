"use client"

import dynamic from "next/dynamic"

const MapView = dynamic(() => import("@/components/map/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-60 items-center justify-center rounded-xl bg-gray-100">
      <p className="text-sm text-gray-500">Chargement de la carte...</p>
    </div>
  ),
})

interface ShopMapProps {
  name: string
  address?: string | null
  slug: string
  latitude?: number | null
  longitude?: number | null
}

export function ShopMap({ name, address, slug, latitude, longitude }: ShopMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
        Localisation non disponible
      </div>
    )
  }

  return (
    <MapView
      locations={[
        { lat: latitude, lng: longitude, nom: name, adresse: address || undefined, slug, type: "boutique" },
      ]}
      center={[latitude, longitude]}
      zoom={15}
      height="240px"
      showUserLocation={false}
    />
  )
}