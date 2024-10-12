'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { MapPin, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import MapComponent from '@/app/dashboard/(components)/MapComponent'

interface FieldLocationProps {
  selectedLocation: string
  coordinates: [number, number] | null
  onLocationSelect: (locationName: string, coords: [number, number]) => void
  errorMessage?: string
}

export default function FieldLocation({
  selectedLocation,
  coordinates,
  onLocationSelect,
  errorMessage,
}: FieldLocationProps) {
  const [showMapTiler, setShowMapTiler] = useState(true)

  return (
    <div className='space-y-4'>
      <Card className='w-full'>
        <CardHeader className='space-y-1 flex flex-row items-center justify-between'>
          <CardTitle className='text-xl font-bold'>Field Location</CardTitle>
          <div className='flex items-center space-x-2'>
            <Switch
              id='map-tiler-toggle'
              checked={showMapTiler}
              onCheckedChange={setShowMapTiler}
            />
            <Label htmlFor='map-tiler-toggle' className='text-sm font-normal'>
              {showMapTiler ? 'High-Res' : 'Standard'} Map
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8 ml-2'>
                    <Info className='h-4 w-4' />
                    <span className='sr-only'>Location selection info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click on the map to select the field location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-md overflow-hidden border border-border'>
            <MapComponent
              onLocationSelect={onLocationSelect}
              showMapTiler={showMapTiler}
            />
          </div>
          {selectedLocation && coordinates && (
            <div className='flex items-center space-x-2'>
              <Badge variant='secondary' className='text-sm'>
                <MapPin className='w-4 h-4 mr-1' />
                {selectedLocation}
              </Badge>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onLocationSelect('', [0, 0])}
                className='text-muted-foreground hover:text-foreground'
              >
                Clear
              </Button>
            </div>
          )}
          {errorMessage && (
            <p className='text-sm text-destructive flex items-center'>
              <Info className='w-4 h-4 mr-2' />
              {errorMessage}
            </p>
          )}
        </CardContent>
        <CardFooter className='bg-muted/50 text-sm text-muted-foreground'>
          <p>
            Drag the map or use the zoom controls to find your exact field
            location.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
