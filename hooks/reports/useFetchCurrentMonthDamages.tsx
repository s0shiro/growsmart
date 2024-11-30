import { getDamagesPerMunicipality } from '@/lib/damages'
import { useQuery } from '@tanstack/react-query'

interface DateRange {
  from?: Date
  to?: Date
}

//useGetCurrentMonthDamages
export const useFetchDamagesByMunicipality = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['damages-by-municipality', dateRange?.from, dateRange?.to],
    queryFn: () => getDamagesPerMunicipality(dateRange),
  })
}

export default useFetchDamagesByMunicipality
