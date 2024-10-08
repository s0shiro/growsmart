import { useQuery } from '@tanstack/react-query'
import { getAssociation } from '../../myfarmers/actions'

const AssociationName = ({ associationID }: { associationID: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['farmer-association', associationID],
    queryFn: async () => await getAssociation(associationID),
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
