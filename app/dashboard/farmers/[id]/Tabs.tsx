import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import FarmerProfile from './FarmerProfile'
import { getOneFarmer } from '@/lib/farmer'

const FarmerProfileTabs = async ({ id }: { id: any }) => {
  const farmer = await getOneFarmer(id)
  return (
    <Tabs defaultValue='profile'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='planting'>Planting</TabsTrigger>
          <TabsTrigger value='harvests'>Harvests</TabsTrigger>
          <TabsTrigger value='damages' className='hidden sm:flex'>
            Damages
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='profile'>
        <FarmerProfile
          firstname={farmer?.firstname}
          lastname={farmer?.lastname}
          gender={farmer?.gender}
        />
      </TabsContent>
      <TabsContent value='planting'></TabsContent>
      <TabsContent value='harvests'></TabsContent>
      <TabsContent value='damages'></TabsContent>
    </Tabs>
  )
}

export default FarmerProfileTabs
