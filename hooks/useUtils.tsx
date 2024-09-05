import { getFarmerNameById } from '@/lib/association'
import { getCropNameById } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

export const useFetchCropName = (cropId: string) => {
  return useQuery({
    queryKey: ['cropName', cropId],
    queryFn: () => getCropNameById(cropId),
    enabled: !!cropId, // Only run the query if cropId is not null or undefined
  })
}

export const useFetchFarmerName = (farmerId: string) => {
  return useQuery({
    queryKey: ['farmerName', farmerId],
    queryFn: () => getFarmerNameById(farmerId),
    enabled: !!farmerId, // Only run the query if cropId is not null or undefined
  })
}
