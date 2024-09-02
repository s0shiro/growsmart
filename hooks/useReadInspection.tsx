import { getInspectionStatusRecords } from '@/lib/planting'
import { getCurrentUser } from '@/lib/users '
import { useQuery } from '@tanstack/react-query'

const fetchInpectionStatus = async () => {
  const user = await getCurrentUser()

  return await getInspectionStatusRecords(user?.id ?? '')
}

export const useReadInspections = () => {
  return useQuery({
    queryKey: ['inspections'],
    queryFn: fetchInpectionStatus,
  })
}

export default useReadInspections
