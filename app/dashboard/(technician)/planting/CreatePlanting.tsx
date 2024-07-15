import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TreePalm } from 'lucide-react'

import DailogForm from '../../(components)/DialogForm'
import CreatePlantingForm from '../(components)/PlantingForm'

function CreatePlanting() {
  return (
    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
        <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center justify-center'>
              <TreePalm size={150} color='#006400' />
            </CardTitle>
          </CardHeader>
          <CardFooter className='flex items-center justify-center'>
            <DailogForm
              id='create-trigger'
              title='Create Planting'
              Trigger={<Button variant='outline'>Add Planting+</Button>}
              form={<CreatePlantingForm />}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default CreatePlanting
