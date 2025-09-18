'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import StatCard from '@/components/StatCard'
import { BarChart2, Clock, ShoppingBag, Sprout, Users, Zap } from 'lucide-react'
import MonthlyProductionChart from './charts/MonthlyProductionChart'
import CategoryDistributionChart from './charts/CategoryDistributionChart'
import SalesChannelChart from './charts/SalesChannelChart'
import { Greeting } from './Greeting'
import { useTechnicianProfile } from '@/hooks/users/useTechnicianProfile'
import { useSession } from '@/stores/useSession'

interface UserData {
  id: string
  email: string | undefined
  fullName: string | null // Allow null
  avatarUrl: string | null // Allow null
  jobTitle: string | null // Allow null
  role: string | null // Allow null
  status: string | null // Allow null
}

interface DashboardClientProps {
  userData: UserData
}

export default function DashboardClient({ userData }: DashboardClientProps) {
  const user = useSession((state) => state.user)

  const { data, error, isFetching } = useTechnicianProfile(userData.id)
  return (
    <>
      <motion.div
        className='mb-8'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Greeting name={userData.fullName} />
      </motion.div>
      <Card className='py-4'>
        <CardContent>
          <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {userData?.role === 'technician' && (
              <>
                <StatCard
                  name='My Farmers'
                  icon={Users}
                  value={isFetching ? 'Loading...' : data?.totalFarmers}
                  color='#8B5CF6'
                />
                <StatCard
                  name='Standing Crops'
                  icon={Clock}
                  value={isFetching ? 'Loading...' : data?.pendingInspections}
                  color='#EC4899'
                />
                <StatCard
                  name='Harvested Farms'
                  icon={Sprout}
                  value={isFetching ? 'Loading...' : data?.harvestedPlantings}
                  color='#10B981'
                />
                {/* <StatCard
                  name='Conversion Rate'
                  icon={BarChart2}
                  value='12.5%'
                  color='#10B981'
                /> */}
              </>
            )}
          </motion.div>

          <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
            <CategoryDistributionChart />
            <MonthlyProductionChart />
            {/* <SalesChannelChart /> */}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
