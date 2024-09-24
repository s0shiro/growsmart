import { getCropsByCategory, getVarietiesByCrop } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

// Hook to fetch crops based on selected category
export const useFetchCrops = (categoryId: string) => {
  return useQuery({
    queryKey: ['crops', categoryId],
    queryFn: () => getCropsByCategory(categoryId),
    enabled: !!categoryId, // Only run this query if categoryId is truthy
  })
}

// Hook to fetch varieties based on selected crop
export const useFetchVarieties = (cropId: string) => {
  return useQuery({
    queryKey: ['varieties', cropId],
    queryFn: () => getVarietiesByCrop(cropId),
    enabled: !!cropId, // Only run this query if cropId is truthy
  })
}
