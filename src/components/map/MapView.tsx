"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { MapPin } from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface Location {
  lat: number
  lng: number
  nom: string
  adresse?: string
  slug?: string
  type?: "boutique" | "promotion"
}

interface MapViewProps {
  locations: Location[]
  center?: [number, number]
  zoom?: number
  height?: string
  showUserLocation?: boolean
}

function UserLocationMarker() {
  const map = useMap()
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setPosition(coords)
          map.flyTo(coords, map.getZoom())
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [map])

  if (!position) return null

  const userIcon = new L.DivIcon({
    className: "user-location-marker",
    html: '<div style="background:#3b82f6;width:16px;height:16px;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>Vous êtes ici</Popup>
    </Marker>
  )
}

export function MapView({
  locations,
  center = [-4.2634, 15.2429],
  zoom = 12,
  height = "400px",
  showUserLocation = true,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-xl bg-gray-100"
      >
        <div className="text-center text-gray-500">
          <MapPin className="mx-auto mb-2 h-8 w-8" />
          <p className="text-sm">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  const defaultIcon = new L.DivIcon({
    className: "custom-marker",
    html: '<div style="background:#f97316;color:white;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;font-weight:bold">📍</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })

  return (
    <div style={{ height, width: "100%" }} className="rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showUserLocation && <UserLocationMarker />}
        {locations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={defaultIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{loc.nom}</p>
                {loc.adresse && <p className="text-gray-600">{loc.adresse}</p>}
                {loc.slug && (
                  <a
                    href={`/boutiques/${loc.slug}`}
                    className="mt-1 inline-block text-primary-500 hover:underline"
                  >
                    Voir la boutique →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
