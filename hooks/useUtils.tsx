import { getFarmerNameById } from '@/lib/association'
import { getCropNameById } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

export const useFetchCropName = (cropId: string) => {
  return useQuery({
    queryKey: ['cropName', cropId],
    queryFn: () => getCropNameById(cropId),
  })
}

export const useFetchFarmerName = (farmerId: string) => {
  return useQuery({
    queryKey: ['farmerName', farmerId],
    queryFn: () => getFarmerNameById(farmerId),
  })
}
