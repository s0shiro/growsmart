import { getCountOfFarmers } from '@/lib/farmer'
import { getCurrentUser } from '@/lib/users'
import { useQuery } from '@tanstack/react-query'

const useFarmersCount = () => {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => await getCurrentUser(),
  })
  const userId = user?.id ?? ''

  const { data: farmersCount, isLoading } = useQuery({
    queryKey: ['farmersCount', userId],
    queryFn: async () => await getCountOfFarmers(userId),
    enabled: !!userId, // Only run this query if userId is available
  })

  return { farmersCount, isLoading }
}

export default useFarmersCount
