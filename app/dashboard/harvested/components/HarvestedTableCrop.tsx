'use client'

import { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import useFetchHarvestedStatus from '@/hooks/crop/useFetchHarvestedStatus'
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
import { Badge } from '@/components/ui/badge'
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
import { getStatusColor } from '@/lib/utils'

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

const HarvestedCropsTable = () => {
  const { data, isFetching } = useFetchHarvestedStatus()
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

  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
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

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle>Harvested Crops</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col sm:flex-row gap-2 items-start sm:items-center'>
          <div className='relative flex-grow'>
            <Input
              placeholder='Search crops...'
              value={searchTerm}
              onChange={handleSearch}
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
            {paginatedRecords.map((record, index) => (
              <TableRow
                key={record.id} // Ensure unique key for each row
                className={index % 2 === 0 ? 'bg-muted/50' : ''}
              >
                <TableCell className='font-medium'>
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
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/farmers/${record.farmer_id}`}>
                          View Farmer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/harvested/${record.id}`}>
                          Harvest Details
                        </Link>
                      </DropdownMenuItem>
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
              filteredRecords.length,
              (currentPage - 1) * itemsPerPage + 1,
            )}{' '}
            to {Math.min(filteredRecords.length, currentPage * itemsPerPage)} of{' '}
            {filteredRecords.length} entries
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

export default HarvestedCropsTable
