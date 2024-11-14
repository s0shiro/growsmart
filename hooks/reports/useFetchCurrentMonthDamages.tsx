import { getDamagesPerMonth } from '@/lib/damages'
import { useQuery } from '@tanstack/react-query'

//useGetCurrentMonthDamages
const useFetchDamagesCurrentMonth = () => {
  return useQuery({
    queryKey: ['damages-current-month'],
    queryFn: async () => {
      const data = await getDamagesPerMonth()
      return data
    },
  })
}

export default useFetchDamagesCurrentMonth
