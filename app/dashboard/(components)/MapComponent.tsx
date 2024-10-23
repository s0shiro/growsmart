'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import type { LatLng, LatLngExpression, Map as LeafletMap } from 'leaflet'
import { useMapEvents } from 'react-leaflet'
import { Search, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
const ScaleControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ScaleControl),
  { ssr: false },
)
const FullscreenControl = dynamic(
  () => import('react-leaflet-fullscreen').then((mod) => mod.FullscreenControl),
  { ssr: false },
)

interface MapComponentProps {
  onLocationSelect: (locationName: string, coords: [number, number]) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([
    13.4417, 121.9473,
  ])
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl
      leaflet.Icon.Default.mergeOptions({
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
      setL(leaflet)
      setLoading(false)
    })
  }, [])

  const fetchLocationName = useCallback(
    async (lat: number, lng: number): Promise<string> => {
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
    },
    [],
  )

  const handleSearch = useCallback(async () => {
    setSearchError(null)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) }
        setPosition(newPosition)
        setMapCenter(newPosition)
        mapRef.current?.flyTo(newPosition, 13)
        const locationName = await fetchLocationName(
          parseFloat(lat),
          parseFloat(lon),
        )
        onLocationSelect(locationName, [parseFloat(lat), parseFloat(lon)])
      } else {
        setSearchError('No results found. Please try a different search term.')
      }
    } catch (error) {
      console.error('Failed to search location:', error)
      setSearchError('An error occurred while searching. Please try again.')
    }
  }, [searchQuery, fetchLocationName, onLocationSelect])

  const debouncedSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch()
    }, 300) // Debounce for 300ms
  }, [handleSearch])

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch()
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearch])

  const LocationMarker: React.FC = () => {
    const map = useMapEvents({
      async click(e) {
        const newPosition = e.latlng
        setPosition(newPosition)
        map.flyTo(newPosition, map.getZoom())
        const locationName = await fetchLocationName(
          newPosition.lat,
          newPosition.lng,
        )
        onLocationSelect(locationName, [newPosition.lat, newPosition.lng])
      },
    })

    useEffect(() => {
      mapRef.current = map
    }, [map])

    return position === null ? null : <Marker position={position} />
  }

  if (loading) {
    return <div>Loading map...</div>
  }

  if (!L) {
    return null
  }

  return (
    <div className='space-y-4'>
      <div className='flex space-x-2 pt-4'>
        <Input
          type='text'
          placeholder='Search for a location'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-grow'
          aria-label='Search for a location'
        />
        <Button onClick={handleSearch}>
          <Search className='h-4 w-4 mr-2' />
          Search
        </Button>
      </div>
      {searchError && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}
      <div className='h-[400px] w-full'>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
          <ScaleControl position='bottomleft' />
          <FullscreenControl position='topright' />
        </MapContainer>
      </div>
    </div>
  )
}

export default MapComponent
