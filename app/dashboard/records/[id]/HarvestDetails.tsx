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
  yield_quantity: number
}

// Define an interface for the harvest record
interface HarvestRecord {
  planting_date: string
  weather_condition: string | null
  expenses: number
  field_location: string
  harvest_records: HarvestRecords[]
}

const HarvestDetails = ({ harvest }: { harvest: HarvestRecord }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Harvest Details</CardTitle>
        <CardDescription>{harvest.field_location}</CardDescription>
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
            {harvest.harvest_records.map((record, index) => (
              <div key={index}>
                <p>
                  <strong>Harvest Date:</strong>{' '}
                  {formatDate(record.harvest_date)}
                </p>
                <p>
                  <strong>Yield Quantity:</strong> {record.yield_quantity} kg
                </p>
                <p>
                  <strong>Profit:</strong> ₱{record.profit}
                </p>
              </div>
            ))}
          </div>
          <div>
            <h2 className='font-semibold text-lg'>Details</h2>
            <p>
              <strong>Planting Date:</strong>{' '}
              {formatDate(harvest.planting_date)}
            </p>
            <p>
              <strong>Weather Condition:</strong> {harvest.weather_condition}
            </p>
            <p>
              <strong>Expenses Incurred:</strong> ₱{harvest.expenses}
            </p>
          </div>
        </div>
        <div className='mt-4'>
          <h2 className='font-semibold text-lg'>Actions</h2>
          <Button className='mr-2'>Add Note</Button>
          <Button>Upload Photo</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default HarvestDetails
