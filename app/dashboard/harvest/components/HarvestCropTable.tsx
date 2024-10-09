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
import { ChevronLeft, ChevronRight, Wheat } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import useFetchPlantings from '@/hooks/crop/useFetchPlantings'
import DialogForm from '@/app/dashboard/(components)/forms/DialogForm'
import HarvestForm from '@/app/dashboard/(components)/forms/HarvestForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Crop {
  id: string
  harvest_date: string
  farmer_id: string
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
  expenses: number
  crop_categories: {
    name: string
  }
}

export default function HarvestCropTable() {
  const { data: plantings, isFetching } = useFetchPlantings()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCrop, setFilterCrop] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  const itemsPerPage = 5

  const filteredPlantings = useMemo(() => {
    if (!Array.isArray(plantings)) return []
    return plantings.filter(
      (planting: any) =>
        (planting.technician_farmers.firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          planting.technician_farmers.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          planting.crops.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (filterCrop === null || planting.crops.name === filterCrop) &&
        (activeTab === 'all' ||
          planting.crop_categories.name.toLowerCase() ===
            activeTab.toLowerCase()),
    )
  }, [plantings, searchTerm, filterCrop, activeTab])

  const totalPages = Math.ceil(filteredPlantings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPlantings = filteredPlantings.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const cropTypes = useMemo(
    () => [
      ...new Set(
        Array.isArray(plantings)
          ? plantings.map((planting: any) => planting.crops.name)
          : [],
      ),
    ],
    [plantings],
  )

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Harvest Crops</h1>

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
              <TableHead>Harvest Date</TableHead>
              <TableHead>Quantity (kg)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching
              ? Array.from({ length: 7 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className='h-4 w-[100px]' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedPlantings.map((planting: any) => (
                  <TableRow key={planting.id}>
                    <TableCell>{`${planting.technician_farmers.firstname} ${planting.technician_farmers.lastname}`}</TableCell>
                    <TableCell>{planting.crops.name}</TableCell>
                    <TableCell>{planting.crop_varieties.name}</TableCell>
                    <TableCell>{formatDate(planting.harvest_date)}</TableCell>
                    <TableCell>{planting.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <DialogForm
                        id={`create-harvest`}
                        title='Record Harvest'
                        description={`Record harvest for ${planting.crops.name}`}
                        Trigger={
                          <Button variant='ghost' size='sm'>
                            <Wheat className='mr-2 h-4 w-4' />
                            Harvest
                          </Button>
                        }
                        form={
                          <HarvestForm
                            plantingID={planting.id}
                            farmerID={planting.farmer_id}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {!isFetching && filteredPlantings.length === 0 && (
        <div className='text-center py-4'>
          No harvest records found matching the current filters.
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
              filteredPlantings.length === 0
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
