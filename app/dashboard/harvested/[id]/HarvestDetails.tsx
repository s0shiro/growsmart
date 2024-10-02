'use client'

import React from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/utils'
import {
  Edit3,
  Trash2,
  ArrowLeftCircle,
  UploadCloud,
  Calendar,
  MapPin,
  DollarSign,
  Droplet,
  Scale,
  AlertTriangle,
  Eye,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

interface Visit {
  id: string
  date: string
  damaged: number
  findings: string
  created_at: string
  planting_id: string
  damaged_reason: string
}

interface HarvestRecord {
  id: string
  profit: number
  user_id: string
  farmer_id: string
  created_at: string
  planting_id: string
  harvest_date: string
  area_harvested: number
  damaged_reason: string
  harvest_images: string[]
  yield_quantity: number
  damaged_quantity: number
}

interface HarvestData {
  id: string
  crop_type: string
  variety: string
  planting_date: string
  expenses: number
  field_location: string
  harvest_records: HarvestRecord[]
  crops: { name: string }
  crop_varieties: { name: string }
  inspections: Visit[]
}

const HarvestDetails = ({ harvest }: { harvest: HarvestData }) => {
  const {
    id,
    crop_type,
    variety,
    planting_date,
    expenses,
    field_location,
    harvest_records,
    crops,
    crop_varieties,
    inspections,
  } = harvest

  const latestHarvest = harvest_records[0]

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A'
    return `₱${amount.toLocaleString()}`
  }

  const finalProfit =
    latestHarvest && expenses !== undefined
      ? latestHarvest.profit - expenses
      : undefined

  const totalDamaged =
    inspections.reduce((sum, visit) => sum + (visit.damaged || 0), 0) +
    harvest_records.reduce(
      (sum, record) => sum + (record.damaged_quantity || 0),
      0,
    )

  return (
    <div>
      <Card className='overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-xl'>
        <CardHeader className='bg-gradient-to-r from-green-400 to-blue-500 text-white p-6'>
          <div className='flex justify-between items-center'>
            <div>
              <CardTitle className='text-3xl font-bold mb-2'>
                Harvest Details
              </CardTitle>
              <CardDescription className='text-xl text-gray-100'>
                {crops?.name || 'Unknown Crop'} -{' '}
                {crop_varieties?.name || 'Unknown Variety'}
              </CardDescription>
            </div>
            <div className='flex space-x-2'>
              <Button size='sm' variant='secondary'>
                <Edit3 className='mr-2 h-4 w-4' />
                <span className='hidden sm:inline'>Edit</span>
              </Button>
              <Button size='sm' variant='destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                <span className='hidden sm:inline'>Delete</span>
              </Button>
              <Button size='sm' variant='outline'>
                <ArrowLeftCircle className='mr-2 h-4 w-4' />
                <span className='hidden sm:inline'>Back</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden'>
              <CardHeader className='bg-gray-100 dark:bg-gray-600 p-4'>
                <CardTitle className='text-xl font-semibold'>Summary</CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <ul className='space-y-3'>
                  <li className='flex items-center justify-between'>
                    <span className='flex items-center text-gray-600 dark:text-gray-300'>
                      <Calendar className='mr-2 h-4 w-4' />
                      Planting Date
                    </span>
                    <Badge variant='outline'>{formatDate(planting_date)}</Badge>
                  </li>
                  <li className='flex items-center justify-between'>
                    <span className='flex items-center text-gray-600 dark:text-gray-300'>
                      <MapPin className='mr-2 h-4 w-4' />
                      Field Location
                    </span>
                    <Badge variant='outline'>{field_location}</Badge>
                  </li>
                  <li className='flex items-center justify-between'>
                    <span className='flex items-center text-gray-600 dark:text-gray-300'>
                      <DollarSign className='mr-2 h-4 w-4' />
                      Expenses
                    </span>
                    <Badge variant='outline'>{formatCurrency(expenses)}</Badge>
                  </li>
                  {latestHarvest && (
                    <>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-gray-600 dark:text-gray-300'>
                          <DollarSign className='mr-2 h-4 w-4' />
                          Revenue
                        </span>
                        <Badge variant='outline'>
                          {formatCurrency(latestHarvest.profit)}
                        </Badge>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='flex items-center text-gray-600 dark:text-gray-300'>
                          <DollarSign className='mr-2 h-4 w-4' />
                          Final Profit
                        </span>
                        <Badge
                          variant={
                            finalProfit !== undefined
                              ? finalProfit >= 0
                                ? 'default'
                                : 'destructive'
                              : 'outline'
                          }
                        >
                          {formatCurrency(finalProfit)}
                        </Badge>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
            {harvest_records.length > 0 && (
              <Card className='bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden'>
                <CardHeader className='bg-gray-100 dark:bg-gray-600 p-4'>
                  <CardTitle className='text-xl font-semibold'>
                    Harvest Details
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  <ScrollArea className='h-[300px] pr-4'>
                    {harvest_records.map((record, index) => (
                      <div
                        key={record.id}
                        className={index !== 0 ? 'mt-4 pt-4 border-t' : ''}
                      >
                        <h4 className='text-lg font-semibold mb-2'>
                          {formatDate(record.harvest_date)}
                        </h4>
                        <ul className='space-y-2'>
                          <li className='flex items-center justify-between'>
                            <span className='flex items-center text-gray-600 dark:text-gray-300'>
                              <Droplet className='mr-2 h-4 w-4' />
                              Yield
                            </span>
                            <Badge>{record.yield_quantity} kg</Badge>
                          </li>
                          <li className='flex items-center justify-between'>
                            <span className='flex items-center text-gray-600 dark:text-gray-300'>
                              <Scale className='mr-2 h-4 w-4' />
                              Area Harvested
                            </span>
                            <Badge>{record.area_harvested} ha</Badge>
                          </li>
                          <li className='flex items-center justify-between'>
                            <span className='flex items-center text-gray-600 dark:text-gray-300'>
                              <AlertTriangle className='mr-2 h-4 w-4' />
                              Harvesting Damaged
                            </span>
                            <Badge variant='destructive'>
                              {record.damaged_quantity || 0}
                            </Badge>
                          </li>
                          <li className='flex items-center justify-between'>
                            <span className='flex items-center text-gray-600 dark:text-gray-300'>
                              <AlertTriangle className='mr-2 h-4 w-4' />
                              Total Damaged
                            </span>
                            <Badge variant='destructive'>
                              {totalDamaged} kg
                            </Badge>
                          </li>
                          <li className='flex items-center justify-between'>
                            <span className='flex items-center text-gray-600 dark:text-gray-300'>
                              <AlertTriangle className='mr-2 h-4 w-4' />
                              Damage Reasons
                            </span>
                            <Badge variant='outline'>
                              {[
                                ...new Set([
                                  record.damaged_reason,
                                  ...inspections.map((i) => i.damaged_reason),
                                ]),
                              ].join(', ')}
                            </Badge>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
          <Separator className='my-8' />
          <Card className='bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden'>
            <CardHeader className='bg-gray-100 dark:bg-gray-600 p-4'>
              <CardTitle className='text-xl font-semibold'>
                Visit Summary
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <Card className='bg-white dark:bg-gray-600 shadow-sm'>
                    <CardContent className='p-4'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Total Visits
                      </p>
                      <h3 className='text-2xl font-bold mt-1'>
                        {inspections.length}
                      </h3>
                    </CardContent>
                  </Card>
                  <Card className='bg-white dark:bg-gray-600 shadow-sm'>
                    <CardContent className='p-4'>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Total damage during visits
                      </p>
                      <h3 className='text-2xl font-bold mt-1 text-red-600 dark:text-red-400'>
                        {inspections.reduce(
                          (sum, visit) => sum + (visit.damaged || 0),
                          0,
                        )}{' '}
                        kg
                      </h3>
                    </CardContent>
                  </Card>
                </div>
                <Separator />
                <h4 className='font-semibold text-lg mb-2'>Recent Visits</h4>
                <ScrollArea className='h-[300px]'>
                  {inspections.map((visit, index) => (
                    <Card
                      key={visit.id}
                      className='mb-4 bg-white dark:bg-gray-600 shadow-sm'
                    >
                      <CardContent className='p-4'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='font-medium text-lg'>
                            {formatDate(visit.date)}
                          </span>
                          <Badge
                            variant={
                              visit.damaged > 0 ? 'destructive' : 'default'
                            }
                          >
                            {visit.damaged > 0
                              ? `${visit.damaged} kg damaged`
                              : 'No damage'}
                          </Badge>
                        </div>
                        <p className='text-gray-600 dark:text-gray-300 mb-2'>
                          {visit.findings}
                        </p>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-500 dark:text-gray-400'>
                            Reason: {visit.damaged_reason}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
                <Link href={`/dashboard/standing/${id}`}>
                  <Button variant='outline' className='w-full'>
                    <Eye className='mr-2 h-4 w-4' />
                    View All Visits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Separator className='my-8' />
          <Card className='bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden'>
            <CardHeader className='bg-gray-100 dark:bg-gray-600 p-4'>
              <CardTitle className='text-xl font-semibold'>
                Harvest Photos
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {latestHarvest &&
                  latestHarvest.harvest_images.map((url, index) => (
                    <div
                      key={index}
                      className='aspect-square relative rounded-lg overflow-hidden'
                    >
                      <Image
                        src={url}
                        alt={`Harvest Photo ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
              </div>
              <Button className='mt-4 w-full sm:w-auto' variant='outline'>
                <UploadCloud className='mr-2 h-4 w-4' />
                Upload Photos
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default HarvestDetails