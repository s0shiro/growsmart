import { getPlantingRiceCropForTheCurrentMonth } from '@/lib/rice.report'
import { useQuery } from '@tanstack/react-query'

const useFetchMonthlyPlantingRice = () => {
  return useQuery({
    queryKey: ['rice-monthly-planting'],
    queryFn: async () => {
      const data = await getPlantingRiceCropForTheCurrentMonth()
      return data
    },
  })
}

export default useFetchMonthlyPlantingRice
