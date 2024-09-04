import { getCropNameById } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

const fetchCropName = async (cropId: string) => {
  const data = await getCropNameById(cropId)
  return data
}

export const useFetchCropName = (cropId: string) => {
  return useQuery({
    queryKey: ['cropName', cropId],
    queryFn: () => fetchCropName(cropId),
    enabled: !!cropId, // Only run the query if cropId is not null or undefined
  })
}
