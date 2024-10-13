'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [tempLocation, setTempLocation] = useState('')
  const [tempCoordinates, setTempCoordinates] = useState<
    [number, number] | null
  >(null)
  const [editedLocation, setEditedLocation] = useState('')

  const handleLocationSelect = (
    locationName: string,
    coords: [number, number],
  ) => {
    setTempLocation(locationName)
    setTempCoordinates(coords)
    setEditedLocation(locationName)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirm = () => {
    onLocationSelect(editedLocation, tempCoordinates!)
    setIsConfirmDialogOpen(false)
  }

  return (
    <div className='space-y-4 relative z-0'>
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
              onLocationSelect={handleLocationSelect}
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

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className={cn('z-50')}>
          <DialogHeader>
            <DialogTitle>Confirm Field Location</DialogTitle>
            <DialogDescription>
              Please review and confirm the selected field location. You can
              edit the location name if needed.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='location' className='text-right'>
                Location
              </Label>
              <Input
                id='location'
                value={editedLocation}
                onChange={(e) => setEditedLocation(e.target.value)}
                className='col-span-3'
              />
            </div>
            {tempCoordinates && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Coordinates</Label>
                <span className='col-span-3'>
                  {tempCoordinates[0].toFixed(6)},{' '}
                  {tempCoordinates[1].toFixed(6)}
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
