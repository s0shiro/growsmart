'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllPlantingRecords } from '@/lib/planting'
import { MoreHorizontal, Loader2, Search, Calendar, Wheat, MapPin, DollarSign, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface PlantingRecord {
  id: string
  created_at: string
  farmer_id: string
  crop_type: string
  variety: string
  planting_date: string
  field_location: string
  area_planted: number
  quantity: number
  weather_condition: string
  expenses: number
  harvest_date: string | null
  user_id: string
  status: string
  crop_categoryId: string
  crops: {
    name: string
  }
  crop_varieties: {
    name: string
  }
}

const PlantingRecords = ({ farmerID }: { farmerID: string }) => {
  const { data: plantingRecords, isLoading, isError } = useQuery<PlantingRecord[]>({
    queryKey: ['plantingRecords', farmerID],
    queryFn: () => getAllPlantingRecords(farmerID),
  })

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PlantingRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-destructive">Error loading planting records. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  const filteredRecords = plantingRecords?.filter((record: PlantingRecord) =>
    record.crops.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.crop_varieties.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.field_location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecords = filteredRecords.slice(startIndex, endIndex)

  const totalPlantings = filteredRecords.length
  const totalArea = filteredRecords.reduce((sum, record) => sum + record.area_planted, 0)
  const totalExpenses = filteredRecords.reduce((sum, record) => sum + record.expenses, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Planting Records</CardTitle>
        <CardDescription>
          View and manage planting records for the selected farmer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="bg-primary/10">
              <CardContent className="p-4 flex items-center space-x-2">
                <Wheat className="text-primary h-8 w-8" />
                <div>
                  <p className="text-sm font-medium">Total Plantings</p>
                  <p className="text-2xl font-bold">{totalPlantings}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="p-4 flex items-center space-x-2">
                <MapPin className="text-primary h-8 w-8" />
                <div>
                  <p className="text-sm font-medium">Total Area</p>
                  <p className="text-2xl font-bold">{totalArea.toFixed(2)} ha</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10">
              <CardContent className="p-4 flex items-center space-x-2">
                <DollarSign className="text-primary h-8 w-8" />
                <div>
                  <p className="text-sm font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold">₱{totalExpenses.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-1/2 mb-4">
            <Search className="text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Planting Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((record: PlantingRecord) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.crops.name}</TableCell>
                    <TableCell>{record.crop_varieties.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(new Date(record.planting_date), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={record.status === 'inspection' ? 'outline' : 'default'}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </TableCell>
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
                            setSelectedRecord(record)
                            setIsDetailsDialogOpen(true)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {record.status === "harvested" && (
                            <DropdownMenuItem>
                              <Link href={`/dashboard/harvested/${record.id}`} className="flex items-center">
                                <DollarSign className="mr-2 h-4 w-4" />
                                Harvest Details
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalPlantings)} of {totalPlantings} entries
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <DetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        record={selectedRecord}
      />
    </Card>
  )
}

interface DetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  record: PlantingRecord | null
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({ isOpen, onClose, record }) => {
  if (!record) return null

  const statusColor = record.status === 'inspection' ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            Planting Record Details
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{record.crops.name}</h3>
                <p className="text-sm text-muted-foreground">{record.crop_varieties.name}</p>
              </div>
              <Badge variant="outline" className={`${statusColor} text-white`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Planting Date</h4>
                <p className="text-lg">{format(new Date(record.planting_date), 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Field Location</h4>
                <p className="text-lg">{record.field_location}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Area Planted</h4>
                <p className="text-lg">{record.area_planted} ha</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Quantity</h4>
                <p className="text-lg">{record.quantity}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Weather Condition</h4>
              <div className="flex items-center space-x-2">
                {record.weather_condition === 'Rainy' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                <span className="text-lg">{record.weather_condition}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Expenses</h4>
              <p className="text-2xl font-bold text-green-600">₱{record.expenses.toFixed(2)}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default PlantingRecords