"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

// Fix for Leaflet icon issues in Next.js
const customIcon = L.divIcon({
  className: "leaflet-v2-marker",
  html: "<div></div>",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

function ChangeView({ center }: { center: L.LatLngExpression }) {
  const map = useMap()
  map.setView(center)
  return null
}

interface PropertyMapProps {
  address: string
  title: string
}

export default function PropertyMap({ address, title }: PropertyMapProps) {
  // Simulating coordinates based on address for demo purposes
  // In a real app, these would come from the property data or a geocoding service
  const [position, setPosition] = useState<L.LatLngExpression>([37.7749, -122.4194])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate finding a location
    const timer = setTimeout(() => {
      // Random-ish variation based on title to make different properties look different
      const seed = title.length
      const lat = 34 + (seed % 10) * 0.5
      const lng = -118 + (seed % 10) * 0.5
      setPosition([lat, lng])
    }, 500)
    return () => clearTimeout(timer)
  }, [title])

  if (!mounted) return null

  return (
    <div className="relative w-full h-full map-container group">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup className="custom-popup">
            <div className="p-2 min-w-[150px]">
              <p className="font-bold text-foreground text-sm mb-1">{title}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Glossy Controls Overlay */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <Button variant="outline" size="icon" className="glass h-10 w-10 rounded-xl border-white/20">
          <Navigation className="h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-[400] glass px-4 py-2 rounded-2xl border border-white/20 shadow-xl pointer-events-none">
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Verified Geospatial Data</span>
        </div>
      </div>
    </div>
  )
}
