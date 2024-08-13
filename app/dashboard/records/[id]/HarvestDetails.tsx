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
import { formatDate } from '@/lib/utils'
import { Edit3, Trash2, ArrowLeftCircle, UploadCloud } from 'lucide-react'

interface HarvestRecords {
  profit: number
  harvest_date: string
  damaged_reason: string
  yield_quantity: number
  damaged_quantity: number
  name: string
  added_by: string
  farmer_id: string
  planting_id: string
  id: string
}

interface HarvestData {
  crop_type: string
  variety: string
  planting_date: string
  weather_condition: string | null
  expenses: number
  field_location: string
  harvests_report: HarvestRecords[]
}

const HarvestDetails = ({ harvest }: { harvest: HarvestData }) => {
  const {
    crop_type,
    variety,
    planting_date,
    weather_condition,
    expenses,
    field_location,
    harvests_report,
  } = harvest

  const imageUrlHost =
    'https://lzbjbeovjpnaktxpdfcn.supabase.co/storage/v1/object/public/crops-images/'

  const imageUrls = harvest.harvests_report.map((report) => {
    return `${imageUrlHost}${report.added_by}/${report.farmer_id}/${report.planting_id}/${report.id}/${report.name}`
  })

  return (
    <div className='container mx-auto px-1 py-1'>
      <Card className='p-1 shadow-lg rounded-lg'>
        <CardHeader className='border-b pb-6'>
          <CardTitle className='text-3xl font-bold mb-2'>
            Harvest Details
          </CardTitle>
          <CardDescription className='text-xl text-gray-500 mb-4'>
            {crop_type} - {variety}
          </CardDescription>
          <div className='flex flex-wrap justify-end space-x-2'>
            <Button className='mb-2 md:mb-0'>
              <div className='hidden sm:block'>Edit Harvest</div>
              <div className='block sm:hidden'>
                <Edit3 />
              </div>
            </Button>
            <Button variant='destructive' className='mb-2 md:mb-0'>
              <div className='hidden sm:block'>Delete Harvest</div>
              <div className='block sm:hidden'>
                <Trash2 />
              </div>
            </Button>
            <Button variant='secondary'>
              <div className='hidden sm:block'>Back to Harvest List</div>
              <div className='block sm:hidden'>
                <ArrowLeftCircle />
              </div>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='p-4 shadow-md rounded-lg'>
              <CardTitle className='text-2xl font-semibold mb-4'>
                Summary
              </CardTitle>
              <div className='mt-4 border-t pt-4 space-y-2'>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>
                    Planting Date:
                  </span>
                  <span className='font-semibold foreground'>
                    {formatDate(planting_date)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>
                    Field Location:
                  </span>
                  <span className='font-semibold foreground'>
                    {field_location}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>
                    Weather Condition:
                  </span>
                  <span className='font-semibold foreground'>
                    {weather_condition || 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>Expenses:</span>
                  <span className='font-semibold foreground'>₱{expenses}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>Profit:</span>
                  <span className='font-semibold foreground'>
                    ₱{harvests_report[0].profit}
                  </span>
                </div>
              </div>
            </Card>
            {harvests_report.length > 0 && (
              <Card className='p-4 shadow-md rounded-lg'>
                <CardTitle className='text-2xl font-semibold mb-4'>
                  Harvest Records
                </CardTitle>
                {harvests_report.map((record, index) => (
                  <div key={index} className='mt-4 border-t pt-4 space-y-2'>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Harvest Date:
                      </span>
                      <span className='font-semibold foreground'>
                        {formatDate(record.harvest_date)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Yield Quantity:
                      </span>
                      <span className='font-semibold foreground'>
                        {record.yield_quantity} kg
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Damaged Quantity:
                      </span>
                      <span className='font-semibold foreground'>
                        {record.damaged_quantity} kg
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Damaged Reason:
                      </span>
                      <span className='font-semibold foreground'>
                        {record.damaged_reason}
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
          <div className='mt-8'>
            <Card className='p-4 shadow-md rounded-lg'>
              <CardTitle className='text-2xl font-semibold mb-4'>
                Photos
              </CardTitle>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                {imageUrls.map((url, index) => (
                  <Card key={index} className='p-1'>
                    <CardContent className='relative aspect-square items-center justify-center p-6'>
                      <div className='relative w-full h-full'>
                        <Image
                          src={url}
                          alt={`Harvest Photo ${index + 1}`}
                          fill
                          className='rounded-lg object-cover'
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button className='mt-4'>
                <UploadCloud className='mr-2' />
                <span>Upload Photos</span>
              </Button>
            </Card>
          </div>
          <div className='mt-8'>
            <Card className='p-4 shadow-md rounded-lg'>
              <CardTitle className='text-2xl font-semibold mb-4'>
                Related Records
              </CardTitle>
              <div className='text-lg'>
                <p>
                  <strong className='font-medium text-gray-700'>
                    Previous Harvests:
                  </strong>
                  <a
                    href={`/harvests?crop=${crop_type}&field=${field_location}`}
                    className='text-blue-600 underline'
                  >
                    View
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HarvestDetails
