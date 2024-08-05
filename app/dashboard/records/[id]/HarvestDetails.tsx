import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  Edit3,
  Trash2,
  ArrowLeftCircle,
  FileText,
  UploadCloud,
} from 'lucide-react'

interface HarvestRecords {
  profit: number
  harvest_date: string
  damaged_reason: string
  yield_quantity: number
  damaged_quantity: number
}

interface HarvestData {
  crop_type: string
  variety: string
  planting_date: string
  weather_condition: string | null
  expenses: number
  field_location: string
  harvest_records: HarvestRecords[]
}

const HarvestDetails = ({ harvest }: { harvest: HarvestData }) => {
  const {
    crop_type,
    variety,
    planting_date,
    weather_condition,
    expenses,
    field_location,
    harvest_records,
  } = harvest

  return (
    <div className='container mx-auto px-1 py-3'>
      <Card className='p-6 shadow-lg rounded-lg'>
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
              <div className='text-lg space-y-2'>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>
                    Planting Date:
                  </span>{' '}
                  <span className='font-semibold foreground'>
                    {formatDate(planting_date)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>
                    Field Location:
                  </span>{' '}
                  <span className='font-semibold foreground'>
                    {field_location}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>
                    Weather Condition:
                  </span>{' '}
                  <span className='font-semibold foreground'>
                    {weather_condition || 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-500'>Expenses:</span>{' '}
                  <span className='font-semibold foreground'>₱{expenses}</span>
                </div>
              </div>
            </Card>
            {harvest_records.length > 0 && (
              <Card className='p-4 shadow-md rounded-lg'>
                <CardTitle className='text-2xl font-semibold mb-4'>
                  Harvest Records
                </CardTitle>
                {harvest_records.map((record, index) => (
                  <div key={index} className='mt-4 border-t pt-4 space-y-2'>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Harvest Date:
                      </span>{' '}
                      <span className='font-semibold foreground'>
                        {formatDate(record.harvest_date)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Yield Quantity:
                      </span>{' '}
                      <span className='font-semibold foreground'>
                        {record.yield_quantity} kg
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Damaged Quantity:
                      </span>{' '}
                      <span className='font-semibold foreground'>
                        {record.damaged_quantity} kg
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>
                        Damaged Reason:
                      </span>{' '}
                      <span className='font-semibold foreground'>
                        {record.damaged_reason}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-gray-500'>Profit:</span>{' '}
                      <span className='font-semibold foreground'>
                        ₱{record.profit}
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
                Actions
              </CardTitle>
              <div className='flex space-x-2'>
                <Button className='mr-2'>
                  <div className='hidden sm:block'>Add Note</div>
                  <div className='block sm:hidden'>
                    <FileText />
                  </div>
                </Button>
                <Button>
                  <div className='hidden sm:block'>Upload Photo</div>
                  <div className='block sm:hidden'>
                    <UploadCloud />
                  </div>
                </Button>
              </div>
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
                  </strong>{' '}
                  <a
                    href={`/harvests?crop=${crop_type}&field=${field_location}`}
                    className='text-blue-600 underline'
                  >
                    View Previous Harvests
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
