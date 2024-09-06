'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card' // Import the Card component
import {
  Home,
  Sprout,
  UserPlus,
  FileText,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import DialogForm from '../../(components)/DialogForm'
import CropForm from '../add-crops/CropForm'

// Mock data for demonstration
const cropData = [
  {
    id: 1,
    category: 'Palay',
    name: 'Rice',
    variety: 'Jasmine',
  },
  {
    id: 2,
    category: 'Corn',
    name: 'Sweet Corn',
    variety: 'Golden Bantam',
  },
  {
    id: 3,
    category: 'High Value',
    name: 'Tomato',
    variety: 'Beefsteak',
  },
  {
    id: 4,
    category: 'Vegetable',
    name: 'Carrot',
    variety: 'Nantes',
  },
  {
    id: 5,
    category: 'Fruit',
    name: 'Apple',
    variety: 'Gala',
  },
  {
    id: 6,
    category: 'Legume',
    name: 'Peanut',
    variety: 'Valencia',
  },
  {
    id: 7,
    category: 'Grain',
    name: 'Wheat',
    variety: 'Durum',
  },
  {
    id: 8,
    category: 'Legume',
    name: 'Peanut',
    variety: 'Valencia',
  },
  {
    id: 9,
    category: 'Grain',
    name: 'Wheat',
    variety: 'Durum',
  },
  // Add more mock data as needed
]

export default function CropTable() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const filteredCrops = cropData
    .filter((crop) => activeTab === 'All' || crop.category === activeTab)
    .filter(
      (crop) =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const pageCount = Math.ceil(filteredCrops.length / itemsPerPage)
  const paginatedCrops = filteredCrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className='flex flex-col sm:flex-row h-screen bg-background text-foreground'>
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Crops</h1>
          <DialogForm
            id='create-trigger'
            title='Add Farmer'
            // Trigger={<Button variant='outline'>Add Farmer+</Button>}
            description='Add farmer to your list.'
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
          <Button
            variant={activeTab === 'All' ? 'default' : 'outline'}
            onClick={() => setActiveTab('All')}
          >
            All
          </Button>
          <Button
            variant={activeTab === 'Palay' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Palay')}
          >
            Palay
          </Button>
          <Button
            variant={activeTab === 'Corn' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Corn')}
          >
            Corn
          </Button>
          <Button
            variant={activeTab === 'High Value' ? 'default' : 'outline'}
            onClick={() => setActiveTab('High Value')}
          >
            High Value
          </Button>
        </div>

        <div className='relative flex items-center mb-4'>
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
        </div>

        <Card className='p-4 overflow-y-auto'>
          <ScrollArea className='h-[calc(100vh-350px)]'>
            <Table className='min-w-[800px] table-auto divide-y divide-border'>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Variety</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCrops.map((crop) => (
                  <TableRow key={crop.id} className='bg-white dark:bg-inherit'>
                    <TableCell className='whitespace-nowrap text-sm'>
                      {crop.name}
                    </TableCell>
                    <TableCell>{crop.category}</TableCell>
                    <TableCell>{crop.variety}</TableCell>

                    <TableCell>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={`Edit ${crop.name}`}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        aria-label={`Delete ${crop.name}`}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </Card>

        <div className='flex justify-between items-center mt-4 flex-wrap'>
          <p className='text-sm text-muted-foreground'>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredCrops.length)} of{' '}
            {filteredCrops.length} entries
          </p>
          <div className='flex space-x-2 mt-2 sm:mt-0'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setCurrentPage((prev) => Math.min(pageCount, prev + 1))
              }
              disabled={currentPage === pageCount}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
