import { getHighValueInspectionData } from '@/lib/highvalue.report'
import { useQuery } from '@tanstack/react-query'

const useHighValueInspection = () => {
  return useQuery({
    queryKey: ['high-value-report'],
    queryFn: async () => {
      const data = await getHighValueInspectionData()
      return data
    },
  })
}

export default useHighValueInspection
