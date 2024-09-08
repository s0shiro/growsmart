'use client'
import StatCard from '@/components/StatCard'
import { Users } from 'lucide-react'
import useFarmersCount from '@/hooks/farmer/useFarmerCount'

const FarmersCountCard = () => {
  const { farmersCount, isLoading } = useFarmersCount()

  return (
    <div>
      <StatCard
        name='My Farmers'
        icon={Users}
        value={isLoading ? 'Loading...' : (farmersCount ?? 0)}
        color='#8B5CF6'
      />
    </div>
  )
}

export default FarmersCountCard
