import { readAssociations } from '@/app/dashboard/association/actions'
import { useQuery } from '@tanstack/react-query'

const fetchAssociations = async () => {
  return await readAssociations()
}

const useReadAssociation = () => {
  return useQuery({
    queryKey: ['associations'],
    queryFn: fetchAssociations,
    select: (data) =>
      data?.map((association) => ({
        ...association,
        name: association.name ?? 'Unnamed Association',
      })),
  })
}

export default useReadAssociation
