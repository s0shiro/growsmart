import { useQuery } from '@tanstack/react-query'
import { getAssistancesByFarmerID } from '@/lib/farmer.assistance'

export default function useFetchAssitanceOfFarmerById(farmerID: string) {
  return useQuery({
    queryKey: ['assistances', farmerID],
    queryFn: async () => {
      const assistances = await getAssistancesByFarmerID(farmerID)
      return assistances
    },
  })
}
