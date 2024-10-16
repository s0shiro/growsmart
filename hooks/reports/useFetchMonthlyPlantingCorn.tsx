import { getMonthlyCornPlantingAccomplishment } from '@/lib/corn.reports'
import { useQuery } from '@tanstack/react-query'

const useFetchMonthlyPlantingCorn = () => {
  return useQuery({
    queryKey: ['corn-monthly-planting'],
    queryFn: async () => {
      const data = await getMonthlyCornPlantingAccomplishment()
      return data
    },
  })
}

export default useFetchMonthlyPlantingCorn
