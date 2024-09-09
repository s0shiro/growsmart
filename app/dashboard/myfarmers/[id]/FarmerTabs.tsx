import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FarmerProfile from './FarmerProfile'
import { getOneFarmer } from '@/lib/farmer'
import PlantingRecords from './PlantingRecords'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const FarmerProfileTabs = async ({ id }: { id: any }) => {
  const farmer = await getOneFarmer(id)

  return (
    <div className='min-h-screen bg-background text-gray-100 p-8'>
      <Card className='max-w-3xl mx-auto bg-background text-gray-100'>
        <CardHeader>
          <div className='flex items-center space-x-4'>
            <Avatar className='w-20 h-20 border-2 border-primary'>
              <AvatarFallback className='text-2xl'>CN</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className='text-2xl font-bold'>
                Farmer Profile
              </CardTitle>
              <p className='text-gray-400'>Manage your farmer information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='profile' className='w-full'>
            <TabsList className='grid w-full grid-cols-4 bg-gray-700'>
              <TabsTrigger value='profile'>Profile</TabsTrigger>
              <TabsTrigger value='planting'>Planting Records</TabsTrigger>
              <TabsTrigger value='harvests'>Harvests Report</TabsTrigger>
              <TabsTrigger value='damages'>Interventions</TabsTrigger>
            </TabsList>
            <TabsContent value='profile'>
              <Card className='bg-gray-700 border-gray-600'>
                <CardHeader>
                  <CardTitle>Farmer Details</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-400'>
                        Full Name
                      </label>
                      <p className='text-lg'>
                        {farmer?.firstname} {farmer?.lastname}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-400'>
                        Gender
                      </label>
                      <p className='text-lg'>{farmer?.gender}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-400'>
                        Address
                      </label>
                      <p className='text-lg'>
                        {farmer?.barangay}, {farmer?.municipality}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-400'>
                        Contact No.
                      </label>
                      <p className='text-lg'>{farmer?.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='planting'>
              <Card className='bg-gray-700 border-gray-600'>
                <CardHeader>
                  <CardTitle>Planting Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <PlantingRecords farmerID={id} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='harvests'>
              <Card className='bg-gray-700 border-gray-600'>
                <CardHeader>
                  <CardTitle>Harvests Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Harvests report content goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='damages'>
              <Card className='bg-gray-700 border-gray-600'>
                <CardHeader>
                  <CardTitle>Damages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Damages content goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default FarmerProfileTabs
