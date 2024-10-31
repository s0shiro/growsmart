import { getHarvestedRiceCropsData } from '@/lib/rice.report'
import { useQuery } from '@tanstack/react-query'

const useFetchHarvestedRice = (municipality: string, waterSupply: string) => {
  return useQuery({
    queryKey: ['harvested-rice-crops', municipality, waterSupply],
    queryFn: async () => {
      const data = await getHarvestedRiceCropsData(municipality, waterSupply)
      return data
    },
    enabled: !!municipality && !!waterSupply,
  })
}

export default useFetchHarvestedRice
