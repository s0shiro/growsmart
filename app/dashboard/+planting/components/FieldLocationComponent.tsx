import React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import { MapPin, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import MapComponent from '@/app/dashboard/(components)/MapComponent'

interface FieldLocationProps {
  selectedLocation: string
  onLocationSelect: (locationName: string) => void
  errorMessage?: string
}

const FieldLocation: React.FC<FieldLocationProps> = ({
                                                       selectedLocation,
                                                       onLocationSelect,
                                                       errorMessage,
                                                     }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Field Location</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Location selection info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click on the map to select the field location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[400px] rounded-md overflow-hidden border border-border">
          <MapComponent onLocationSelect={onLocationSelect} />
        </div>
        {selectedLocation && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {selectedLocation}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLocationSelect('')}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        )}
        {errorMessage && (
          <p className="text-sm text-destructive flex items-center">
            <Info className="w-4 h-4 mr-2" />
            {errorMessage}
          </p>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 text-sm text-muted-foreground">
        <p>Drag the map or use the zoom controls to find your exact field location.</p>
      </CardFooter>
    </Card>
  )
}

export default FieldLocation