import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Search } from 'lucide-react'
import useFetchHarvestedStatus from '@/hooks/useFetchHarvestedStatus'
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

const HarvestedCropsTable = () => {
  const { data, isFetching } = useFetchHarvestedStatus()
  const allPlantingRecords: PlantingRecords[] = data
    ? (data as PlantingRecords[])
    : []

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRecords, setFilteredRecords] = useState<PlantingRecords[]>([])

  useEffect(() => {
    setFilteredRecords(allPlantingRecords)
  }, [allPlantingRecords])

  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = allPlantingRecords.filter(
      (record) =>
        record.crop_type.toLowerCase().includes(term) ||
        record.field_location.toLowerCase().includes(term),
    )
    setFilteredRecords(filtered)
  }

  return (
    <motion.div
      className='bg-card bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-foreground'>Harvested</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search crops...'
            className='bg-input text-foreground placeholder-muted-foreground rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className='absolute left-3 top-2.5 text-muted-foreground'
            size={18}
          />
        </div>
      </div>

      <div className='overflow-x-auto'>
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
            {filteredRecords.map((record) => (
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

                <td className='px-6 py-4 whitespace-nowrap m:table-cell hidden sm:table-cell'>
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
                      record.status === 'harvested'
                        ? 'bg-red-800 text-red-100'
                        : 'bg-green-800 text-green-100'
                    }`}
                  >
                    {record.status}
                  </span>
                </td>

                <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/dashboard/farmers/${record.farmer_id}`}>
                          View Farmer
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link href={`/dashboard/records/${record.id}`}>
                          Harvest Details
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
export default HarvestedCropsTable
