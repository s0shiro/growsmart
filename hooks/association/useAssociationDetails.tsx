import { getAssociationDetails } from '@/app/dashboard/association/actions'
import { useQuery } from '@tanstack/react-query'

const fetchAssociationDetails = async (associationId: string) => {
  return await getAssociationDetails(associationId)
}

export const useAssociationDetails = (associationId: string) => {
  return useQuery({
    queryKey: ['associationDetails', associationId],
    queryFn: () => fetchAssociationDetails(associationId),
  })
}

export default useAssociationDetails
