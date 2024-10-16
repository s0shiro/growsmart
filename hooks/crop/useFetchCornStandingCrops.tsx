import { getStandingCornCrops } from '@/lib/corn.reports'
import { useQuery } from '@tanstack/react-query'

const useFetchCornStandingCrops = () => {
  return useQuery({
    queryKey: ['corn-standing-crops'],
    queryFn: async () => {
      const data = await getStandingCornCrops()
      return data
    },
  })
}

export default useFetchCornStandingCrops
