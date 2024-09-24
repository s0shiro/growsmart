'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import DialogForm from '../../(components)/DialogForm'
import CropForm from '../add-crops/CropForm'
import { useFetchAllRegisteredCrops } from '@/hooks/crop/useFetchAllRegisteredCrops'
import CropTable from './CropTable'
import Pagination from './Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Define types for the data structure
interface CropVariety {
  id: string
  name: string | null
  crop_id: string
  created_at: string
}

interface Crop {
  id: string
  name: string | null
  created_at: string
  category_id: string
  crop_varieties: CropVariety[]
}

interface Category {
  id: string
  created_at: string
  name: string | null
  crops: Crop[]
}

export interface FlattenedCrop {
  id: string
  name: string | null
  variety: string | null
  category: string | null
}

// Flatten the crops and varieties
const flattenCrops = (data: Category[]): FlattenedCrop[] => {
  return data.flatMap((category) =>
    category.crops.flatMap((crop) =>
      crop.crop_varieties.map((variety) => ({
        id: variety.id,
        name: crop.name,
        variety: variety.name,
        category: category.name,
      })),
    ),
  )
}

export default function CropTableContainer() {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  const {
    data: cropDataFromQuery,
    isLoading,
    error,
  } = useFetchAllRegisteredCrops()

  useEffect(() => {
    // Reset current page to 1 whenever the active tab changes
    setCurrentPage(1)
  }, [activeTab])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  // Ensure data is defined before flattening
  const cropData: FlattenedCrop[] = cropDataFromQuery
    ? flattenCrops(cropDataFromQuery)
    : []

  // Filter by category and search term
  const filteredCrops = cropData
    .filter(
      (crop) =>
        activeTab === 'All' ||
        crop.category?.toLowerCase() === activeTab.toLowerCase(),
    )
    .filter(
      (crop) =>
        crop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Pagination logic
  const pageCount = Math.ceil(filteredCrops.length / itemsPerPage)
  const paginatedCrops = filteredCrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className='flex flex-col sm:flex-row bg-background text-foreground'>
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Crops</h1>
          <DialogForm
            id='create-trigger'
            title='Add Crop'
            description='Add a new crop to your list.'
            Trigger={
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add Crop
              </Button>
            }
            form={<CropForm />}
          />
        </div>

        <div className='flex space-x-2 mb-4'>
          {['All', 'Palay', 'Corn', 'High-Value'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className='relative flex items-center mb-4 space-x-2'>
          <Input
            type='search'
            placeholder='Search crops...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='bg-input text-foreground placeholder-muted-foreground rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary max-w-sm'
          />
          <Search
            className='absolute left-3 top-2.5 text-muted-foreground'
            size={18}
          />
          <Select
          // value={filterStatus}
          // onValueChange={(value) =>
          //   setFilterStatus(value as Production['status'] | 'All')
          // }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by crops' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All crops</SelectItem>
              <SelectItem value='Planting'>palay</SelectItem>
              <SelectItem value='Growing'>corn</SelectItem>
              <SelectItem value='Inspection'>high-value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CropTable crops={paginatedCrops} />

        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
