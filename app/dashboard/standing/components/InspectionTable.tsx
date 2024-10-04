'use client'

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import useReadInspections from '@/hooks/crop/useReadInspection'
import { formatDate } from '@/lib/utils'

//TODO: Define Crop interface
interface Crop {
  id: string
  planting_date: string
  harvest_date: string
  status: string
  technician_farmers: {
    lastname: string
    firstname: string
  }
  crops: {
    name: string
  }
}

export default function CropInspections() {
  const { data: crops, isLoading, error } = useReadInspections()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCrop, setFilterCrop] = useState<string | null>(null)

  const itemsPerPage = 5

  const filteredCrops = useMemo(() => {
    if (!Array.isArray(crops)) return []
    return crops.filter(
      (crop: any) =>
        (crop.technician_farmers.firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          crop.technician_farmers.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          crop.crops.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCrop === null || crop.crops.name === filterCrop),
    )
  }, [crops, searchTerm, filterCrop])

  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCrops = filteredCrops.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const cropTypes = useMemo(
    () => [
      ...new Set(
        Array.isArray(crops) ? crops.map((crop: any) => crop.crops.name) : [],
      ),
    ],
    [crops],
  )

  if (error) {
    return (
      <div className='text-center py-4 text-red-500'>
        Error loading crop inspections. Please try again later.
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Standing Crops</h1>

      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <Input
          placeholder='Search by farmer name or crop'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='md:w-1/2'
          disabled={isLoading}
        />
        <div className='flex-grow'></div>
        <Select
          value={filterCrop || undefined}
          onValueChange={(value: string) =>
            setFilterCrop(value === 'all' ? null : value)
          }
          disabled={isLoading}
        >
          <SelectTrigger className='md:w-1/4'>
            <SelectValue placeholder='Filter by Crop' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Crops</SelectItem>
            {cropTypes.map((crop) => (
              <SelectItem key={crop as React.Key} value={crop as string}>
                {crop as React.ReactNode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className='w-full whitespace-nowrap rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farmer</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Planting Date</TableHead>
              <TableHead>Expected Harvest Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 7 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedCrops.map((crop: any) => (
                  <TableRow key={crop.id}>
                    <TableCell>{`${crop.technician_farmers.firstname} ${crop.technician_farmers.lastname}`}</TableCell>
                    <TableCell>{crop.crops.name}</TableCell>
                    <TableCell>{formatDate(crop.planting_date)}</TableCell>
                    <TableCell>{formatDate(crop.harvest_date)}</TableCell>
                    <TableCell>
                      <span className='px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'>
                        {crop.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/standing/${crop.id}`} passHref>
                        <Button variant='ghost' size='sm'>
                          <Eye className='mr-2 h-4 w-4' />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {!isLoading && filteredCrops.length === 0 && (
        <div className='text-center py-4'>
          No crop inspections found matching the current filters.
        </div>
      )}

      <div className='flex justify-between items-center mt-4'>
        <div>
          {isLoading ? (
            <Skeleton className='h-4 w-[100px]' />
          ) : (
            `Page ${currentPage} of ${totalPages}`
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={isLoading || currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={
              isLoading ||
              currentPage === totalPages ||
              filteredCrops.length === 0
            }
          >
            Next
            <ChevronRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </div>
    </div>
  )
}
