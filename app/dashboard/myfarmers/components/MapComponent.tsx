import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from 'leaflet'
import { useMapEvents } from 'react-leaflet'

// Dynamically import the MapContainer, TileLayer, and Marker components from react-leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false },
)

interface MapComponentProps {
  onLocationSelect: (locationName: string) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)

  useEffect(() => {
    // Dynamically import Leaflet and its dependencies
    import('leaflet').then((leaflet) => {
      // Use type assertion to bypass TypeScript error
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })
      setL(leaflet)
    })
  }, [])

  const fetchLocationName = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
    const data = await response.json()
    const displayName = data.display_name
    const parts = displayName.split(',').slice(0, 4).join(', ')
    return parts
  }

  const LocationMarker: React.FC = () => {
    useMapEvents({
      async click(e) {
        setPosition(e.latlng)
        const locationName = await fetchLocationName(e.latlng.lat, e.latlng.lng)
        onLocationSelect(locationName)
      },
    })

    return position === null ? null : <Marker position={position}></Marker>
  }

  if (!L) {
    return null // Render nothing until Leaflet is loaded
  }

  return (
    <MapContainer
      center={[13.4417, 121.9473]} // Centered on Marinduque
      zoom={12}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  )
}

export default MapComponent