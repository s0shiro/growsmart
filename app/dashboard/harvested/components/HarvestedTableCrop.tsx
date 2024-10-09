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
import { formatDate } from '@/lib/utils'
import useFetchHarvestedStatus from '@/hooks/crop/useFetchHarvestedStatus'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface HarvestedCrop {
  id: string
  technician_farmers: {
    lastname: string
    firstname: string
  }
  crops: {
    name: string
  }
  crop_varieties: {
    name: string
  }
  quantity: number
  harvest_records: {
    harvest_date: string
  }[]
  crop_categories: {
    name: string
  }
}

export default function HarvestedCropTable() {
  const { data: harvestedCrops, isFetching } = useFetchHarvestedStatus()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCrop, setFilterCrop] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const itemsPerPage = 5

  const filteredCrops = useMemo(() => {
    if (!Array.isArray(harvestedCrops)) return []
    return harvestedCrops.filter(
      (crop: any) =>
        (crop.technician_farmers.firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          crop.technician_farmers.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          crop.crops.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCrop === null || crop.crops.name === filterCrop) &&
        (activeTab === 'all' ||
          crop.crop_categories.name.toLowerCase() === activeTab.toLowerCase()),
    )
  }, [harvestedCrops, searchTerm, filterCrop, activeTab])

  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCrops = filteredCrops.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const cropTypes = useMemo(
    () => [
      ...new Set(
        Array.isArray(harvestedCrops)
          ? harvestedCrops.map((crop: any) => crop.crops.name)
          : [],
      ),
    ],
    [harvestedCrops],
  )

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Harvested Crops</h1>

      <Tabs
        defaultValue='all'
        className='w-full mb-4'
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='rice'>Rice</TabsTrigger>
          <TabsTrigger value='corn'>Corn</TabsTrigger>
          <TabsTrigger value='high-value'>High Value</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <Input
          placeholder='Search by farmer name or crop'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='md:w-1/2'
          disabled={isFetching}
        />
        <div className='flex-grow'></div>
        <Select
          value={filterCrop || undefined}
          onValueChange={(value: string) =>
            setFilterCrop(value === 'all' ? null : value)
          }
          disabled={isFetching}
        >
          <SelectTrigger className='md:w-1/4'>
            <SelectValue placeholder='Filter by Crop' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Crops</SelectItem>
            {cropTypes.map((crop) => (
              <SelectItem key={crop} value={crop}>
                {crop}
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
              <TableHead>Variety</TableHead>
              <TableHead>Harvested Date</TableHead>
              <TableHead>Quantity (kg)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching
              ? Array.from({ length: 5 }).map((_, index) => (
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
                    <TableCell>{crop.crop_varieties.name}</TableCell>
                    <TableCell>
                      {formatDate(crop.harvest_records[0]?.harvest_date)}
                    </TableCell>
                    <TableCell>{crop.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/harvested/${crop.id}`} passHref>
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

      {!isFetching && filteredCrops.length === 0 && (
        <div className='text-center py-4'>
          No harvested crops found matching the current filters.
        </div>
      )}

      <div className='flex justify-between items-center mt-4'>
        <div>
          {isFetching ? (
            <Skeleton className='h-4 w-[100px]' />
          ) : (
            `Page ${currentPage} of ${totalPages}`
          )}
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={isFetching || currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-2' />
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={
              isFetching ||
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
