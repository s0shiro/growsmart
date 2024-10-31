import { getTotalHarvestedRiceCropsData } from '@/lib/rice.report'
import { useQuery } from '@tanstack/react-query'

const useFetchTotalHarvestedRice = (municipality: string) => {
  return useQuery({
    queryKey: ['total-harvested-rice-crops', municipality],
    queryFn: async () => {
      const data = await getTotalHarvestedRiceCropsData(municipality)
      return data
    },
    enabled: !!municipality,
  })
}

export default useFetchTotalHarvestedRice
