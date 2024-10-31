import { getHarvestedRiceCropsData } from '@/lib/rice.report'
import useHarvestStore from '@/stores/useRiceHarvestStore'
import { useQuery } from '@tanstack/react-query'

const useFetchHarvestedRice = () => {
  const { selectedMunicipality, selectedWaterSupply, dateRange } =
    useHarvestStore()

  return useQuery({
    queryKey: [
      'harvested-rice-crops',
      {
        municipality: selectedMunicipality,
        waterSupply: selectedWaterSupply,
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
      if (
        !selectedMunicipality ||
        !selectedWaterSupply ||
        !dateRange.from ||
        !dateRange.to
      ) {
        return null
      }

      // Create dates at the start and end of the selected days
      const startDate = new Date(dateRange.from)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999)

      return await getHarvestedRiceCropsData(
        selectedMunicipality,
        selectedWaterSupply,
        startDate,
        endDate,
      )
    },
    enabled:
      !!selectedMunicipality &&
      !!selectedWaterSupply &&
      !!dateRange.from &&
      !!dateRange.to,
  })
}

export default useFetchHarvestedRice
