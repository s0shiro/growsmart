import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const FarmerProfile = ({
  firstname,
  lastname,
  gender,
  municipality,
  barangay,
  phone,
}: {
  firstname?: string
  lastname?: string
  gender?: string
  municipality?: string
  barangay?: string
  phone?: string
}) => {
  return (
    <div className='min-h-screen bg-background text-gray-100 p-8'>
      <Card className='max-w-3xl mx-auto bg-backgroundtext-gray-100'>
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
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-gray-400'>
                  Full Name
                </label>
                <p className='text-lg'>
                  {firstname} {lastname}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-400'>
                  Gender
                </label>
                <p className='text-lg'>{gender}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-400'>
                  Address
                </label>
                <p className='text-lg'>
                  {barangay}, {municipality}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-400'>
                  Contact No.
                </label>
                <p className='text-lg'>{phone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FarmerProfile
