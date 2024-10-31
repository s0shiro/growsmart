import { getTotalHarvestedRiceCropsData } from '@/lib/rice.report'
import useHarvestStore from '@/stores/useRiceHarvestStore'
import { useQuery } from '@tanstack/react-query'

const useFetchTotalHarvestedRice = () => {
  const { selectedMunicipality, dateRange } = useHarvestStore()

  return useQuery({
    queryKey: [
      'total-harvested-rice-crops',
      {
        municipality: selectedMunicipality,
        // Convert the dates to local ISO string to preserve the exact date
        startDate: dateRange.from?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        endDate: dateRange.to?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      },
    ],
    queryFn: async () => {
      if (!selectedMunicipality || !dateRange.from || !dateRange.to) {
        return null
      }

      // Create dates at the start and end of the selected days
      const startDate = new Date(dateRange.from)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)

      return await getTotalHarvestedRiceCropsData(
        selectedMunicipality,
        startDate,
        endDate,
      )
    },
    enabled: !!selectedMunicipality && !!dateRange.from && !!dateRange.to,
  })
}

export default useFetchTotalHarvestedRice
