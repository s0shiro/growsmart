'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllPlantingRecords } from '@/lib/planting'
import { MoreHorizontal, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PlantingRecords = ({ farmerID }: { farmerID: string }) => {
 const { data: plantingRecords, isLoading, isError } = useQuery({
  queryKey: ['plantingRecords', farmerID],
  queryFn: () => getAllPlantingRecords(farmerID),
  //staleTime: 60000, // Cache for 1 minute to prevent excessive fetching
})

  const [isHarvestDialogOpen, setIsHarvestDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-destructive">Error loading planting records. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planting Records</CardTitle>
        <CardDescription>
          View planting records for the selected farmer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop Type</TableHead>
                <TableHead className="hidden sm:table-cell">Variety</TableHead>
                <TableHead>Planting Date</TableHead>
                <TableHead className="hidden sm:table-cell">Field Location</TableHead>
                <TableHead className="hidden sm:table-cell">Area Planted</TableHead>
                <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                <TableHead className="hidden sm:table-cell">Weather</TableHead>
                <TableHead className="hidden sm:table-cell">Expenses</TableHead>
                <TableHead>Harvest Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plantingRecords?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.crop_type}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.variety}</TableCell>
                  <TableCell>{format(new Date(record.planting_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.field_location}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.area_planted}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.quantity}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.weather_condition}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.expenses}</TableCell>
                  <TableCell>{record.harvest_date ? format(new Date(record.harvest_date), 'MMM d, yyyy') : 'Not harvested'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-label="Open menu" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => {
                          setSelectedRecordId(record.id)
                          setIsHarvestDialogOpen(true)
                        }}>
                          Report Harvest
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <HarvestDialog
        isOpen={isHarvestDialogOpen}
        onClose={() => setIsHarvestDialogOpen(false)}
        recordId={selectedRecordId}
      />
    </Card>
  )
}

const HarvestDialog = ({ isOpen, onClose, recordId }: { isOpen: boolean; onClose: () => void; recordId: string | null }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // TODO: Implement harvest reporting logic
    console.log('Reporting harvest for record:', recordId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Harvest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="harvestDate">Harvest Date</Label>
            <Input id="harvestDate" type="date" required />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity Harvested</Label>
            <Input id="quantity" type="number" required />
          </div>
          <Button type="submit">Submit Harvest Report</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PlantingRecords