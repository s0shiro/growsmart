import { getAllCropCategory } from '@/lib/crop'
import { useQuery } from '@tanstack/react-query'

export const useGetAllCropData = () => {
  return useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      try {
        const data = await getAllCropCategory()
        console.log("successfully fetched crop categories")
        return data
      } catch (error) {
        console.error('Error fetching crop categories:', error)
        throw error
      }
    },
  })
}

export default useGetAllCropData
