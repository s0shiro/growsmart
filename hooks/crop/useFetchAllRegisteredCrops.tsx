import { getAllCategoriesWithCropsAndVarieties } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

export const useFetchAllRegisteredCrops = () => {
  return useQuery({
    queryKey: ['registered-crops'],
    queryFn: async () => {
      try {
        const data = await getAllCategoriesWithCropsAndVarieties()
        console.log('Fetched crop categories:', data)
        return data
      } catch (error) {
        console.error('Error fetching crop categories:', error)
        throw error
      }
    },
  })
}
