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
  Search,
  Loader2,
} from 'lucide-react'
import useReadInspections from '@/hooks/crop/useReadInspection'
import InspectionForm from './InpectionForm'
import DialogForm from '../../(components)/forms/DialogForm'
import Link from 'next/link'
import { getStatusColor } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  if (error)
    return (
      <Card className='w-full max-w-6xl mx-auto'>
        <CardContent className='p-6'>
          <p className='text-center text-destructive'>
            Error loading crops data
          </p>
        </CardContent>
      </Card>
    )

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

  return (
    <Card className='w-full max-w-6xl mx-auto overflow-hidden'>
      <CardHeader className='bg-primary/5 border-b'>
        <CardTitle className='text-2xl font-bold'>Standing Crops</CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-6'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
          <div className='relative flex-grow'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search crops...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary'
            />
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
                    {id === 'all'
                      ? 'All'
                      : (Array.isArray(crops) &&
                          crops.find((crop: any) => crop.crop_type === id)
                            ?.crops?.name) ||
                        'Unknown'}
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
                className='flex items-center hover:bg-destructive/10 transition-colors duration-300'
              >
                <X className='mr-2 h-4 w-4' /> Clear Filters
              </Button>
            )}
          </div>
        </div>
        <div className='rounded-md border overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Farmer Name</TableHead>
                <TableHead>Crop Name</TableHead>
                <TableHead>Field Location</TableHead>
                <TableHead>Harvest Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {paginatedCrops.map((crop, index) => (
                  <motion.tr
                    key={crop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <TableCell className='font-medium'>
                      <p>
                        {crop.technician_farmers?.firstname}{' '}
                        {crop.technician_farmers?.lastname}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p>{crop.crops?.name}</p>
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
                          <Link href={`/dashboard/standing/${crop.id}`}>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' />
                              View
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
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
              className='transition-all duration-300 hover:bg-primary/10'
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage((prev) => Math.min(pageCount, prev + 1))
              }
              disabled={currentPage === pageCount}
              className='transition-all duration-300 hover:bg-primary/10'
            >
              Next
              <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
