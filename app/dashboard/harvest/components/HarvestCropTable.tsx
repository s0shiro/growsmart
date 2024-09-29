'use client'

import { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react'
import useFetchPlantings from '@/hooks/crop/useFetchPlantings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CropName from '../../(components)/ui/CropName'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import FarmerName from '../../(components)/ui/FarmerName'
import DialogForm from '../../(components)/forms/DialogForm'
import HarvestForm from '../../(components)/forms/HarvestForm'
import HarvestUploader from '../../(components)/forms/HarvestUploader'
import { getStatusColor } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

type PlantingRecords = {
  area_planted: number
  created_at: string
  crop_type: string
  expenses: number
  farmer_id: string
  field_location: string
  harvest_date: string
  id: string
  planting_date: string
  quantity: number
  status: string
  user_id: string
  variety: string
  weather_condition: string
}

interface Filters {
  cropName: string
  fieldLocation: string
}

const HarvestCropTable = () => {
  const { data, isFetching } = useFetchPlantings()
  const allPlantingRecords: PlantingRecords[] = data
    ? (data as PlantingRecords[])
    : []

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<Filters>({
    cropName: 'all',
    fieldLocation: 'all',
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  const cropNames = useMemo(() => {
    return [
      'all',
      ...new Set(allPlantingRecords.map((record) => record.crop_type)),
    ]
  }, [allPlantingRecords])

  const fieldLocations = useMemo(() => {
    return [
      'all',
      ...new Set(allPlantingRecords.map((record) => record.field_location)),
    ]
  }, [allPlantingRecords])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (type: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      cropName: 'all',
      fieldLocation: 'all',
    })
    setCurrentPage(1)
  }

  const filteredRecords = useMemo(() => {
    return allPlantingRecords.filter((record) => {
      return (
        Object.values(record).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ) &&
        (filters.cropName === 'all' || record.crop_type === filters.cropName) &&
        (filters.fieldLocation === 'all' ||
          record.field_location === filters.fieldLocation)
      )
    })
  }, [allPlantingRecords, searchTerm, filters])

  const pageCount = Math.ceil(filteredRecords.length / itemsPerPage)
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto overflow-hidden">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-2xl font-bold">Harvest Crops</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plantings..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.cropName}
              onValueChange={(value) => handleFilterChange('cropName', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                {cropNames.map((id) => (
                  <SelectItem key={id} value={id}>
                    <CropName cropId={id} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.fieldLocation}
              onValueChange={(value) =>
                handleFilterChange('fieldLocation', value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue
                  placeholder={
                    filters.fieldLocation === 'all'
                      ? 'All Locations'
                      : filters.fieldLocation
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {fieldLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {Object.values(filters).some((filter) => filter !== 'all') && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center hover:bg-destructive/10 transition-colors duration-300"
              >
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Farmer Name</TableHead>
                <TableHead>Crop Name</TableHead>
                <TableHead>Field Location</TableHead>
                <TableHead>Harvest Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {paginatedRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell className="font-medium">
                      <FarmerName farmerId={record.farmer_id} />
                    </TableCell>
                    <TableCell>
                      <CropName cropId={record.crop_type} />
                    </TableCell>
                    <TableCell>{record.field_location}</TableCell>
                    <TableCell>{record.harvest_date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/farmers/${record.farmer_id}`}>
                              View Farmer
                            </Link>
                          </DropdownMenuItem>
                          <DialogForm
                            id="create-harvest"
                            title="Record Harvest"
                            description={`Record harvest`}
                            Trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Record Harvest
                              </DropdownMenuItem>
                            }
                            form={
                              <HarvestForm
                                plantingID={record.id}
                                farmerID={record.farmer_id}
                              />
                            }
                          />
                          <DialogForm
                            id="upload-harvest"
                            title="Record Harvest"
                            description={`Record harvest`}
                            Trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                Harvest Uploader
                              </DropdownMenuItem>
                            }
                            form={
                              <HarvestUploader
                                farmerID={record.farmer_id}
                                plantingID={record.id}
                              />
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(filteredRecords.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredRecords.length, currentPage * itemsPerPage)} of {filteredRecords.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="transition-all duration-300 hover:bg-primary/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(pageCount, prev + 1))
              }
              disabled={currentPage === pageCount}
              className="transition-all duration-300 hover:bg-primary/10"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HarvestCropTable