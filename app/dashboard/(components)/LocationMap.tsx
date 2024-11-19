'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { LatLng, Icon } from 'leaflet'
import { Button } from '@/components/ui/button'
import { Map as MapIcon, Satellite } from 'lucide-react'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useMap } from 'react-leaflet'
import { useToast } from '@/components/hooks/use-toast'

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

const defaultIcon = new Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: `/api/map-tiles?z={z}&x={x}&y={y}`,
    attribution:
      '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
  },
}

interface LocationMapProps {
  latitude: number | null
  longitude: number | null
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [zoom, setZoom] = useState<number>(12)
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street')
  const { toast } = useToast()
  const [mapTilerQuotaExceeded, setMapTilerQuotaExceeded] = useState(false)

  // Add quota check function
  const checkMapTilerQuota = (error: any) => {
    if (error?.target?.status === 429 || error?.target?.status === 403) {
      setMapTilerQuotaExceeded(true)
      setMapStyle('street')
      toast({
        title: 'Satellite view unavailable',
        description: 'Map quota exceeded. Falling back to street view.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      latitude !== null &&
      longitude !== null
    ) {
      setPosition(new LatLng(latitude, longitude))
      setZoom(15)
    }

    return () => {
      setPosition(null)
    }
  }, [latitude, longitude])

  if (!position) {
    return <div>Loading map...</div>
  }

  // Update StyleControl props and types
  const StyleControl = ({
    mapStyle,
    setMapStyle,
    disabled,
  }: {
    mapStyle: 'street' | 'satellite'
    setMapStyle: (value: 'street' | 'satellite') => void
    disabled: boolean
  }) => {
    const map = useMap()

    return (
      <div
        className='leaflet-control leaflet-bar'
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          zIndex: 1000,
        }}
      >
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            setMapStyle(mapStyle === 'street' ? 'satellite' : 'street')
          }
          className='px-3'
          disabled={disabled}
          title={disabled ? 'Satellite view unavailable - quota exceeded' : ''}
        >
          {mapStyle === 'street' ? (
            <Satellite className='h-4 w-4' />
          ) : (
            <MapIcon className='h-4 w-4' />
          )}
        </Button>
      </div>
    )
  }

  // Update MapContainer return JSX
  return (
    <div className='relative h-[400px] w-full'>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <StyleControl
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
          disabled={mapTilerQuotaExceeded}
        />
        <TileLayer
          url={TILE_LAYERS[mapStyle].url}
          attribution={TILE_LAYERS[mapStyle].attribution}
          maxZoom={TILE_LAYERS[mapStyle].maxZoom}
          eventHandlers={{
            tileerror: (error) => {
              if (mapStyle === 'satellite') {
                checkMapTilerQuota(error)
              }
            },
          }}
        />
        <Marker position={position} icon={defaultIcon} />
      </MapContainer>
    </div>
  )
}
