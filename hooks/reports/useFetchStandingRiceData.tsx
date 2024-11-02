// hooks/useRiceStandingData.ts
import { useQuery } from '@tanstack/react-query'
import { getRiceStandingData } from '@/lib/rice.report'

const useRiceStandingData = () => {
  return useQuery({
    queryKey: ['rice-standing-data'],
    queryFn: async () => {
      const data = await getRiceStandingData()
      if (!data) {
        return []
      }
      return data
    },
  })
}

export default useRiceStandingData
