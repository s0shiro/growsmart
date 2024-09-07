import { getAllAssociations } from '@/lib/association'
import { useQuery } from '@tanstack/react-query'

const useFetchAssociations = () => {
  return useQuery({
    queryKey: ['all-associations'],
    queryFn: async () => await getAllAssociations(),
  })
}

export default useFetchAssociations
