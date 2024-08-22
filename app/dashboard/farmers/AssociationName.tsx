import { QueryClient, useQuery } from '@tanstack/react-query'
import { getAssociation } from './actions'

const queryClient = new QueryClient()

const fetchAssociation = async (associationID: string) => {
  return await getAssociation(associationID)
}

const AssociationName = ({ associationID }: { associationID: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['farmer-association', associationID],
    queryFn: () => fetchAssociation(associationID),
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Error loading association</span>
  }

  return <span>{data?.name}</span>
}

export default AssociationName
