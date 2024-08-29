import { getAssociationDetails } from '@/app/dashboard/association/actions'
import { useQuery } from '@tanstack/react-query'

const fetchAssociationDetails = async (associationId: string) => {
  return await getAssociationDetails(associationId)
}

export const useAssociationDetails = (associationId: string) => {
  return useQuery({
    queryKey: ['associationDetails', associationId],
    queryFn: () => fetchAssociationDetails(associationId),
    select: (data) =>
      data?.map((detail) => ({
        ...detail,
        name: detail.firstname ?? 'Unnamed Member',
        position: detail.position ?? '', // Provide a default empty string if null
        association_id: detail.association_id ?? '', // Provide a default empty string if null
      })),
  })
}

export default useAssociationDetails
