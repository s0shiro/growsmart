import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface HarvestRecords {
  profit: number
  harvest_date: string
  damaged_reason: string
  yield_quantity: number
  damaged_quantity: number
}

// Define an interface for the harvest record
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
    <Card>
      <CardHeader>
        <CardTitle>Harvest Details</CardTitle>
        <CardDescription>
          {crop_type} - {variety}
        </CardDescription>
        <div className='flex justify-end space-x-2'>
          <Button>Edit Harvest</Button>
          <Button variant='destructive'>Delete Harvest</Button>
          <Button variant='secondary'>Back to Harvest List</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h2 className='font-semibold text-lg'>Summary</h2>
            <p>
              <strong>Planting Date:</strong> {formatDate(planting_date)}
            </p>
            <p>
              <strong>Field Location:</strong> {field_location}
            </p>
            <p>
              <strong>Weather Condition:</strong> {weather_condition}
            </p>
            <p>
              <strong>Expenses:</strong> ₱{expenses}
            </p>
          </div>
          {harvest_records.length > 0 && (
            <div>
              <h2 className='font-semibold text-lg'>Harvest Records</h2>
              {harvest_records.map((record, index) => (
                <div key={index} className='mt-2'>
                  <p>
                    <strong>Harvest Date:</strong>{' '}
                    {formatDate(record.harvest_date)}
                  </p>
                  <p>
                    <strong>Yield Quantity:</strong> {record.yield_quantity} kg
                  </p>
                  <p>
                    <strong>Damaged Quantity:</strong> {record.damaged_quantity}{' '}
                    kg
                  </p>
                  <p>
                    <strong>Damaged Reason:</strong> {record.damaged_reason}
                  </p>
                  <p>
                    <strong>Profit:</strong> ₱{record.profit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='mt-4'>
          <h2 className='font-semibold text-lg'>Actions</h2>
          <Button className='mr-2'>Add Note</Button>
          <Button>Upload Photo</Button>
        </div>
        <div className='mt-4'>
          <h2 className='font-semibold text-lg'>Related Records</h2>
          <p>
            <strong>Previous Harvests:</strong>{' '}
            <a href={`/harvests?crop=${crop_type}&field=${field_location}`}>
              View Previous Harvests
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default HarvestDetails
