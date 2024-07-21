import { Card, CardContent } from '@/components/ui/card'
import { getCountOfFarmers } from '@/lib/farmer'
import { getCurrentUser } from '@/lib/users '

export default async function Dashboard() {
  const user = await getCurrentUser()
  const farmersCount = await getCountOfFarmers(user?.id ?? '')
  return (
    <div>
      <Card>
        <CardContent>
          <div className='w-full flex h-full justify-center items-center'>
            <div>
              <h4 className='text-lg'>Farmers</h4>
              <h2 className='text-6xl font-semibold my-8 text-center'>
                {farmersCount}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
      <p>I'm fuccked up, idk what to do with this shit.</p>
    </div>
  )
}
