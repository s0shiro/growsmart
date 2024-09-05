import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InspectionCropsTable from './InspectionCropsTable'

const InspectionTabs = () => {
  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='palay'>Palay</TabsTrigger>
          <TabsTrigger value='corn'>Corn</TabsTrigger>
          <TabsTrigger value='high-value'>High Value</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='all'>
        <InspectionCropsTable />
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

export default InspectionTabs
