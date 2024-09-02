import { getInspectionsByPlantingID } from '@/lib/inspection'
import { useQuery } from '@tanstack/react-query'

// const fetchInspectionHistory = async (plantingID: string) => {
//   return await getInspectionsByPlantingID(plantingID)
// }

export const useGetInspectionsById = (plantingID: string) => {
  return useQuery({
    queryKey: ['history', plantingID],
    queryFn: async () => await getInspectionsByPlantingID(plantingID),
  })
}
