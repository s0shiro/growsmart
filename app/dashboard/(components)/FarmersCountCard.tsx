import React, { useEffect, useState } from 'react'
import StatCard from '@/components/StatCard'
import { getCountOfFarmers } from '@/lib/farmer'

import { Users } from 'lucide-react'
import { getCurrentUser } from '@/lib/users '

const FarmersCountCard = () => {
  const [farmersCount, setFarmersCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser()
      const count = await getCountOfFarmers(user?.id ?? '')
      setFarmersCount(count)
    }

    fetchData()
  }, [])

  return (
    <div>
      <StatCard
        name='My Farmers'
        icon={Users}
        value={farmersCount !== null ? farmersCount : 'Loading...'}
        color='#8B5CF6'
      />
    </div>
  )
}

export default FarmersCountCard
