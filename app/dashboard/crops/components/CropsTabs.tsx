import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CropForm from '../add-crops/CropForm'
import { PlusCircle } from 'lucide-react'
import DialogForm from '../../(components)/DialogForm'

const CropsTabs = () => {
  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='palay'>Palay</TabsTrigger>
          <TabsTrigger value='corn'>Corn</TabsTrigger>
          <TabsTrigger value='high-value'>High Value</TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          <DialogForm
            id='create-trigger'
            title='Add Farmer'
            // Trigger={<Button variant='outline'>Add Farmer+</Button>}
            description='Add farmer to your list.'
            Trigger={
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Crop
                </span>
              </Button>
            }
            form={<CropForm />}
          />
        </div>
      </div>
      <TabsContent value='all'>
        <p>Please do this!</p>
      </TabsContent>
      <TabsContent value='palay'>
        <p>To be fix</p>
      </TabsContent>
      <TabsContent value='corn'>
        <p>To be fix</p>
      </TabsContent>
      <TabsContent value='high-value'>
        <p>To be fix</p>
      </TabsContent>
    </Tabs>
  )
}

export default CropsTabs
