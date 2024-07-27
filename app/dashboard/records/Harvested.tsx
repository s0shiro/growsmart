'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { formatDate } from '@/lib/utils'

import Link from 'next/link'
import HarvestForm from './HarvestForm'
import DailogForm from '../(components)/DialogForm'
import useFetchHarvestedStatus from '@/hooks/useFetchHarvestedStatus'

// Define an interface for the planting record
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

const HarvestedStatus = async () => {
  const { data, isFetching } = useFetchHarvestedStatus()
  const allPlantingRecords: PlantingRecords[] = data as PlantingRecords[]

  console.log(allPlantingRecords)

  console.log(allPlantingRecords)
  if (isFetching) {
    return <p>Getting planting records...</p>
  }

  if (allPlantingRecords.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center mt-24'>
        <div className='text-center'>
          <p className='text-xl font-semibold'>No records found.</p>
          <p className='mt-2'>Please add some record to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planting Records</CardTitle>
        <CardDescription>
          View planting records for all farmers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop Type</TableHead>
              <TableHead className='hidden sm:table-cell'>Variety</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='hidden sm:table-cell'>
                Planting Date
              </TableHead>
              <TableHead className='hidden sm:table-cell'>
                Field Location
              </TableHead>
              <TableHead className='hidden sm:table-cell'>
                Area Planted
              </TableHead>
              <TableHead className='hidden sm:table-cell'>Quantity</TableHead>
              <TableHead className='hidden sm:table-cell'>
                Weather Condition
              </TableHead>
              <TableHead className='hidden sm:table-cell'>Expenses</TableHead>
              <TableHead>Harvest Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPlantingRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.crop_type}</TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {record.variety}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                      record.status === 'planted'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'harvested'
                          ? 'bg-red-100 text-red-800 line-through'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {formatDate(record.planting_date)}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {record.field_location}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {record.area_planted} sqm
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {record.quantity}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {record.weather_condition}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  ₱{record.expenses}
                </TableCell>
                <TableCell>{formatDate(record.harvest_date)}</TableCell>
                <TableCell>
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
                          View Harvest
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default HarvestedStatus
