import { useFetchFarmerName } from '@/hooks/useUtils'

const FarmerName = async ({ farmerId }: { farmerId: string }) => {
  const { data: farmerName, isLoading, error } = useFetchFarmerName(farmerId)

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error loading crop name</span>

  return (
    <span>
      {farmerName
        ? `${farmerName.firstname} ${farmerName.lastname}`
        : 'No crop name found'}
    </span>
  )
}

export default FarmerName
