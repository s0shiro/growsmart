import { getAllDamagesDuringVisitation } from '@/lib/damages'
import { useQuery } from '@tanstack/react-query'

const useFetchAllDamagesDuringVisitation = () => {
  return useQuery({
    queryKey: ['visitation-damages'],
    queryFn: async () => await getAllDamagesDuringVisitation(),
  })
}

export default useFetchAllDamagesDuringVisitation
