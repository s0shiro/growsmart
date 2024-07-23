import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AllPlantingsByFarmers from './AllPlantingsByFarmers'

const RecordsTabs = () => {
  return (
    <Tabs defaultValue='recent-plantings'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='recent-plantings'>
            Recent Planting Records
          </TabsTrigger>
          <TabsTrigger value='harvests'>Recent Harvest</TabsTrigger>
          <TabsTrigger value='damages'>Damages</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='recent-plantings'>
        <AllPlantingsByFarmers />
      </TabsContent>
      <TabsContent value='harvests'>
        <p>Lol</p>
      </TabsContent>
      <TabsContent value='damages'>
        <p>I'm tired w/ this shit.</p>
      </TabsContent>
    </Tabs>
  )
}

export default RecordsTabs
