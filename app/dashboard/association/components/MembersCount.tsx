import { useQuery } from '@tanstack/react-query'
import { getFarmerCountByAssociation } from '../actions'

const MembersCount = ({ associationID }: { associationID: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['farmer-count', associationID],
    queryFn: async () => await getFarmerCountByAssociation(associationID),
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Error loading count</span>
  }

  return <span>{data}</span>
}

export default MembersCount
