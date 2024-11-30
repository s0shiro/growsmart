import { getAllDamagesDuringVisitation } from '@/lib/damages'
import { useQuery } from '@tanstack/react-query'

interface DateRange {
  from?: Date
  to?: Date
}

const useFetchAllDamagesDuringVisitation = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['damages', dateRange?.from, dateRange?.to],
    queryFn: () => getAllDamagesDuringVisitation(dateRange),
  })
}

export default useFetchAllDamagesDuringVisitation
