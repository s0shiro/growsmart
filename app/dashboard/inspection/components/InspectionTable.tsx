'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MoreHorizontal,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import useReadInspections from '@/hooks/useReadInspection'
import CropName from './CropName'
import FarmerName from './FarmerName'
import InspectionForm from './InpectionForm'
import DialogForm from '../../(components)/DialogForm'
import Link from 'next/link'

interface Crop {
  id: string
  created_at: string
  farmer_id: string
  crop_type: string
  variety: string
  planting_date: string
  field_location: string
  area_planted: number
  quantity: number
  weather_condition: string | null
  expenses: number
  harvest_date: string
  technician_id?: string
  status: string
}

interface Filters {
  cropName: string
  fieldLocation: string
}

export default function InspectionTable() {
  const { data: crops, isLoading, error } = useReadInspections()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<Filters>({
    cropName: 'all',
    fieldLocation: 'all',
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  const [cropNames, setCropNames] = useState<string[]>([])
  const [fieldLocations, setFieldLocations] = useState<string[]>([])

  useEffect(() => {
    if (Array.isArray(crops)) {
      const uniqueCropNames = [
        'all',
        ...new Set(crops.map((crop) => crop.crop_type)),
      ]
      const uniqueFieldLocations = [
        'all',
        ...new Set(crops.map((crop) => crop.field_location)),
      ]

      setCropNames(uniqueCropNames)
      setFieldLocations(uniqueFieldLocations)
    }
  }, [crops])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading crops data</p>

  const filteredCrops = Array.isArray(crops)
    ? crops.filter((crop) => {
        const typedCrop = crop as Crop
        return (
          Object.values(typedCrop).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
          ) &&
          (filters.cropName === 'all' ||
            typedCrop.crop_type === filters.cropName) &&
          (filters.fieldLocation === 'all' ||
            typedCrop.field_location === filters.fieldLocation)
        )
      })
    : []

  const pageCount = Math.ceil(filteredCrops.length / itemsPerPage)
  const paginatedCrops = filteredCrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'inspection':
        return 'bg-yellow-200 text-yellow-800'
      case 'pending':
        return 'bg-blue-200 text-blue-800'
      case 'completed':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle>Crops available for inspection</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
          <div className='relative flex-grow'>
            <Input
              placeholder='Search crops...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8'
            />
            <Filter className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Select
              value={filters.cropName}
              onValueChange={(value) => handleFilterChange('cropName', value)}
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='All Crops' />
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
              <SelectTrigger className='w-[140px]'>
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
                variant='outline'
                onClick={clearFilters}
                className='flex items-center'
              >
                <X className='mr-2 h-4 w-4' /> Clear Filters
              </Button>
            )}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farmer Name</TableHead>
              <TableHead>Crop Name</TableHead>
              <TableHead>Field Location</TableHead>
              <TableHead>Harvest Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCrops.map((crop, index) => (
              <TableRow
                key={crop.id} // Ensure unique key for each row
                className={index % 2 === 0 ? 'bg-muted/50' : ''}
              >
                <TableCell className='font-medium'>
                  <FarmerName farmerId={crop.farmer_id} />
                </TableCell>
                <TableCell>
                  <CropName cropId={crop.crop_type} />
                </TableCell>
                <TableCell>{crop.field_location}</TableCell>
                <TableCell>{crop.harvest_date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(crop.status)}>
                    {crop.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DialogForm
                        id='create-record'
                        title='Record Planting'
                        description={`Record planting data to ${crop.id}`}
                        Trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Inspect
                          </DropdownMenuItem>
                        }
                        form={<InspectionForm plantingID={crop.id} />}
                      />
                      <Link href={`/dashboard/inspection/${crop.id}`}>
                        <DropdownMenuItem>
                          <Eye className='mr-2 h-4 w-4' />
                          Inspection History
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Showing{' '}
            {Math.min(
              filteredCrops.length,
              (currentPage - 1) * itemsPerPage + 1,
            )}{' '}
            to {Math.min(filteredCrops.length, currentPage * itemsPerPage)} of{' '}
            {filteredCrops.length} entries
          </p>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage((prev) => Math.min(pageCount, prev + 1))
              }
              disabled={currentPage === pageCount}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
