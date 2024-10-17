import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from 'leaflet'
import { useMapEvents } from 'react-leaflet'

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
  onLocationSelect: (locationName: string, coords: [number, number]) => void
  showMapTiler: boolean
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  showMapTiler,
}) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })
      setL(leaflet)
      setLoading(false)
    })
  }, [])

  const fetchLocationName = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      const { village, town, county, state } = data.address
      const locationParts = [village, town, county, state].filter(Boolean)
      return locationParts.join(', ')
    } catch (error) {
      console.error('Failed to fetch location name:', error)
      return 'Unknown location'
    }
  }

  const LocationMarker: React.FC = () => {
    useMapEvents({
      async click(e) {
        setPosition(e.latlng)
        const locationName = await fetchLocationName(e.latlng.lat, e.latlng.lng)
        onLocationSelect(locationName, [e.latlng.lat, e.latlng.lng])
      },
    })

    return position === null ? null : <Marker position={position} />
  }

  if (loading) {
    return <div>Loading map...</div>
  }

  if (!L) {
    return null
  }

  return (
    <div className='h-[300px] sm:h-[400px] w-full'>
      <MapContainer
        center={[13.4417, 121.9473]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {showMapTiler && (
          <TileLayer
            url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
            errorTileUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
        )}
        <LocationMarker />
      </MapContainer>
    </div>
  )
}

export default MapComponent
