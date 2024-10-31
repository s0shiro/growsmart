import { create } from 'zustand'
import { DateRange } from 'react-day-picker'

interface HarvestStore {
  selectedMunicipality: string
  selectedWaterSupply: string
  dateRange: DateRange
  setSelectedMunicipality: (municipality: string) => void
  setSelectedWaterSupply: (waterSupply: string) => void
  setDateRange: (dateRange: DateRange) => void
}

const getInitialDateRange = (): DateRange => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    from: startOfMonth,
    to: endOfMonth,
  }
}

const useHarvestStore = create<HarvestStore>((set) => ({
  selectedMunicipality: '',
  selectedWaterSupply: '',
  dateRange: getInitialDateRange(),
  setSelectedMunicipality: (municipality) =>
    set({ selectedMunicipality: municipality }),
  setSelectedWaterSupply: (waterSupply) =>
    set({ selectedWaterSupply: waterSupply }),
  setDateRange: (newDateRange: DateRange) => {
    set((state) => ({
      dateRange: {
        from: newDateRange.from
          ? new Date(newDateRange.from)
          : state.dateRange.from,
        to: newDateRange.to ? new Date(newDateRange.to) : state.dateRange.to,
      },
    }))
  },
}))

export default useHarvestStore
