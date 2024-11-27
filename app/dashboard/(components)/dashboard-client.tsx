'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import StatCard from '@/components/StatCard'
import { BarChart2, ShoppingBag, Zap } from 'lucide-react'
import FarmersCountCard from './FarmersCountCard'
import MonthlyProductionChart from './charts/MonthlyProductionChart'
import CategoryDistributionChart from './charts/CategoryDistributionChart'
import SalesChannelChart from './charts/SalesChannelChart'

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
  return (
    <>
      <Card className='px-4 py-6'>
        <CardContent>
          <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {userData?.role === 'technician' && (
              <>
                <FarmersCountCard />
                <StatCard
                  name='Pending Harvest'
                  icon={ShoppingBag}
                  value='567'
                  color='#EC4899'
                />
                <StatCard
                  name='Harvested Farms'
                  icon={Zap}
                  value='200'
                  color='#6366F1'
                />
                <StatCard
                  name='Conversion Rate'
                  icon={BarChart2}
                  value='12.5%'
                  color='#10B981'
                />
              </>
            )}
          </motion.div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <MonthlyProductionChart />
            <CategoryDistributionChart />
            <SalesChannelChart />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
