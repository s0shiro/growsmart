import { getAllHarvestedCrops } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

const useFetchAllHarvestedCrops = () => {
  return useQuery({
    queryKey: ['harvested-crops-history'],
    queryFn: async () => {
      const data = await getAllHarvestedCrops()
      return data
    },
  })
}

export default useFetchAllHarvestedCrops
