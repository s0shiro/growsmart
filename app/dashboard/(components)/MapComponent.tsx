'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import type {
  LatLng,
  LatLngExpression,
  Map as LeafletMap,
  LatLngBoundsExpression,
} from 'leaflet'
import { useMapEvents } from 'react-leaflet'
import { Search, AlertCircle, Loader2 } from 'lucide-react'
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

const MARINDUQUE_CENTER: LatLngExpression = [13.4011, 121.9742]
const MARINDUQUE_BOUNDS: LatLngBoundsExpression = [
  [13.1889, 121.8183], // Southwest corner
  [13.5967, 122.1317], // Northeast corner
]

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [mapCenter] = useState<LatLngExpression>(MARINDUQUE_CENTER)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)

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
          throw new Error('Failed to fetch location name')
        }
        const data = await response.json()
        const { village, town, county, state } = data.address
        const locationParts = [village, town, county, state].filter(Boolean)
        return locationParts.join(', ') || 'Marinduque'
      } catch (error) {
        console.error('Failed to fetch location name:', error)
        return 'Marinduque'
      }
    },
    [],
  )

  const handleSearch = useCallback(async () => {
    setSearchError(null)
    setIsSearching(true)
    try {
      console.log('Searching for:', searchQuery)
      const encodedQuery = encodeURIComponent(
        `${searchQuery}, Marinduque, Philippines`,
      )
      const [swLat, swLng, neLat, neLng] = MARINDUQUE_BOUNDS.flat()
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&bounded=1&viewbox=${swLng},${swLat},${neLng},${neLat}&limit=1`
      console.log('Search URL:', url)

      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`,
        )
      }
      const data = await response.json()
      console.log('Search results:', data)

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) }
        console.log('New position:', newPosition)
        if (L && L.latLngBounds(MARINDUQUE_BOUNDS).contains(newPosition)) {
          setPosition(newPosition)
          mapRef.current?.flyTo(newPosition, 13)
          const locationName = await fetchLocationName(
            parseFloat(lat),
            parseFloat(lon),
          )
          onLocationSelect(locationName, [parseFloat(lat), parseFloat(lon)])
        } else {
          setSearchError(
            'Location is outside of Marinduque. Please try a different search term.',
          )
        }
      } else {
        setSearchError(
          'No results found in Marinduque. Please try a different search term.',
        )
      }
    } catch (error) {
      console.error('Failed to search location:', error)
      setSearchError(
        `An error occurred while searching: ${(error as Error).message}. Please try again.`,
      )
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, fetchLocationName, onLocationSelect, L])

  const LocationMarker: React.FC = () => {
    const map = useMapEvents({
      async click(e) {
        const newPosition = e.latlng
        if (L && L.latLngBounds(MARINDUQUE_BOUNDS).contains(newPosition)) {
          setPosition(newPosition)
          map.flyTo(newPosition, map.getZoom())
          const locationName = await fetchLocationName(
            newPosition.lat,
            newPosition.lng,
          )
          onLocationSelect(locationName, [newPosition.lat, newPosition.lng])
        }
      },
    })

    useEffect(() => {
      mapRef.current = map
      map.setMaxBounds(L?.latLngBounds(MARINDUQUE_BOUNDS))
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
          placeholder='Search for a location in Marinduque'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='flex-grow'
          aria-label='Search for a location in Marinduque'
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Search className='h-4 w-4 mr-2' />
          )}
          {isSearching ? 'Searching...' : 'Search'}
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
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          maxBounds={MARINDUQUE_BOUNDS}
          minZoom={10}
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
