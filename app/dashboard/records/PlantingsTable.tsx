import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Search } from 'lucide-react'
import useFetchPlantings from '@/hooks/useFetchPlantings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DialogForm from '../(components)/DialogForm'
import HarvestForm from './HarvestForm'
import HarvestNotificationIcon from './HarvestNotificationIcon'
import HarvestUploader from './HarvestUploader'

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

const PlantingsTable = () => {
  const { data, isFetching } = useFetchPlantings()
  const allPlantingRecords: PlantingRecords[] = data
    ? (data as PlantingRecords[])
    : []

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<PlantingRecords[]>([])

  useEffect(() => {
    setFilteredUsers(allPlantingRecords)
  }, [allPlantingRecords])

  const handleSearch = useCallback(
    (term: string) => {
      const filtered = allPlantingRecords.filter(
        (record) =>
          record.crop_type.toLowerCase().includes(term) ||
          record.field_location.toLowerCase().includes(term),
      )
      setFilteredUsers(filtered)
    },
    [allPlantingRecords],
  )

  const onSearchChange = (e: any) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    handleSearch(term)
  }

  const currentDate = new Date().toISOString().split('T')[0] // Get current date in YYYY-MM-DD format

  const totalAvailableCrops = useMemo(
    () =>
      filteredUsers.filter(
        (record) =>
          new Date(record.harvest_date).toISOString().split('T')[0] <=
          currentDate,
      ).length,
    [filteredUsers, currentDate],
  )

  return (
    <motion.div
      className='bg-card bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='lg:text-xl font-semibold text-foreground'>Plantings</h2>

        <div className='relative flex items-center'>
          <div className='relative'>
            <HarvestNotificationIcon
              totalAvailableCrops={totalAvailableCrops}
            />
          </div>
          <div className='relative flex items-center ml-4'>
            <input
              type='text'
              placeholder='Search plantings...'
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
      </div>

      <div className='mb-4'>
        <span className='text-sm font-medium text-foreground'>
          Total Available Crops for Harvest: {totalAvailableCrops}
        </span>
      </div>

      <div className='overflow-x-auto'>
        {filteredUsers.length === 0 ? (
          <div className='text-center text-muted-foreground py-6'>
            No plantings records found.
          </div>
        ) : (
          <table className='min-w-full divide-y divide-border'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Crop Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
                  Field Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>
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
              {filteredUsers.map((record) => {
                const harvestDate = new Date(record.harvest_date)
                  .toISOString()
                  .split('T')[0] // Format harvest_date

                const isButtonDisabled = harvestDate > currentDate

                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-foreground'>
                        {record.crop_type}
                      </div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                      <div className='text-sm text-muted-foreground'>
                        {record.field_location}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap hidden sm:table-cell'>
                      <div className='text-sm text-muted-foreground'>
                        {record.harvest_date}
                      </div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'planted'
                            ? 'bg-green-800 text-green-100'
                            : 'bg-red-800 text-red-100'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup='true'
                            size='icon'
                            variant='ghost'
                          >
                            <div className='relative'>
                              <MoreHorizontal className='h-4 w-4' />
                              {!isButtonDisabled && (
                                <span className='absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-green-500'></span>
                              )}
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link
                              href={`/dashboard/farmers/${record.farmer_id}`}
                            >
                              View Farmer
                            </Link>
                          </DropdownMenuItem>

                          <DialogForm
                            id='create-harvest'
                            title='Record Harvest'
                            description={`Record harvest`}
                            Trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isButtonDisabled}
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
                            id='upload-harvest'
                            title='Record Harvest'
                            description={`Record harvest`}
                            Trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isButtonDisabled}
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
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  )
}

export default PlantingsTable
