import { getAllFarmers } from '@/lib/farmer'
import { useQuery } from '@tanstack/react-query'

const useFetchAllFarmers = () => {
  return useQuery({
    queryKey: ['all-farmers'],
    queryFn: async () => {
      return await getAllFarmers()
    },
  })
}

export default useFetchAllFarmers
