import { getHarvestedCornCropsData } from '@/lib/corn.reports'
import { useQuery } from '@tanstack/react-query'

const useFetchMonthlyHarvestedCorn = () => {
  return useQuery({
    queryKey: ['corn-monthly-harvest'],
    queryFn: async () => {
      const data = await getHarvestedCornCropsData()
      return data
    },
  })
}

export default useFetchMonthlyHarvestedCorn
