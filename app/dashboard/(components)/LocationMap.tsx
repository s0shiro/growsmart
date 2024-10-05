import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { LatLng, Icon } from 'leaflet'

// Import the default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

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

// Create the default icon for the marker
const defaultIcon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface LocationMapProps {
  latitude: number | null
  longitude: number | null
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude }) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [zoom, setZoom] = useState<number>(12)

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setPosition(new LatLng(latitude, longitude))
      setZoom(15) // Set zoom level to 15 when position is updated
    }
  }, [latitude, longitude])

  if (!position) {
    return <div>Loading map...</div>
  }

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={defaultIcon} />
    </MapContainer>
  )
}

export default LocationMap
