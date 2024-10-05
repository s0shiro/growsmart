import { getFarmerNameById } from '@/lib/association'
import { useQuery } from '@tanstack/react-query'

export const useFetchFarmerName = (farmerId: string) => {
  return useQuery({
    queryKey: ['farmerName', farmerId],
    queryFn: () => getFarmerNameById(farmerId),
  })
}
