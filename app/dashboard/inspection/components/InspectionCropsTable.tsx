'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import useReadInspections from '@/hooks/useReadInspection'
import DialogForm from '../../(components)/DialogForm'
import InspectionForm from './InpectionForm'
import CropName from './CropName'

type CropData = {
  id: string
  crop_type: string
  field_location: string
  harvest_date: string
  status: string
}

export default function InspectionCropsTable() {
  const { data, error, isLoading } = useReadInspections()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCrops, setFilteredCrops] = useState<CropData[]>([])

  useEffect(() => {
    if (data) {
      const mappedData = data.map((item: any) => ({
        id: item.id,
        crop_type: item.crop_type,
        field_location: item.field_location,
        harvest_date: item.harvest_date,
        status: item.status,
      }))
      setFilteredCrops(mappedData)
    }
  }, [data])

  const handleSearch = useCallback(
    (term: string) => {
      if (data) {
        const filtered = filteredCrops.filter(
          (crop) =>
            crop.crop_type.toLowerCase().includes(term) ||
            crop.field_location.toLowerCase().includes(term) ||
            crop.status.toLowerCase().includes(term),
        )
        setFilteredCrops(filtered)
      }
    },
    [filteredCrops],
  )

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    handleSearch(term)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <motion.div
      className='bg-card bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='lg:text-xl font-semibold text-foreground'>
          Crops available for inspection
        </h2>
        <div className='relative flex items-center'>
          <input
            type='text'
            placeholder='Search crops...'
            className='bg-input text-foreground placeholder-muted-foreground rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            value={searchTerm}
            onChange={onSearchChange}
          />
          <Search
            className='absolute left-3 top-2.5 text-muted-foreground'
            size={18}
          />
        </div>
      </div>

      {/* Enable horizontal scrolling for smaller screens */}
      <div className='overflow-x-auto'>
        {filteredCrops.length === 0 ? (
          <div className='text-center text-muted-foreground py-6'>
            No crops found.
          </div>
        ) : (
          <table className='min-w-full divide-y divide-border'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Crop Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Field Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Harvest Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredCrops.map((crop: CropData, index) => (
                <motion.tr
                  key={index}
                  className='bg-white dark:bg-inherit'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-foreground'>
                      <CropName cropId={crop.crop_type} />
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-foreground'>
                      {crop.field_location}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-foreground'>
                      {new Date(crop.harvest_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          crop.status === 'inspection'
                            ? 'bg-yellow-800 text-red-100'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {crop.status}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DialogForm
                          id='create-harvest'
                          title='Inspection Form'
                          description={`Record inspection.`}
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
                            Inspections History
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  )
}
