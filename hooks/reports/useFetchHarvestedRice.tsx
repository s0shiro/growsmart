import { getHarvestedRiceCropsData } from '@/lib/rice.report'
import { useQuery } from '@tanstack/react-query'

const useFetchHarvestedRice = () => {
  return useQuery({
    queryKey: ['harveted-rice-crops'],
    queryFn: async () => {
      const data = await getHarvestedRiceCropsData('Buenavista', 'rainfed')
      return data
    },
  })
}

export default useFetchHarvestedRice
