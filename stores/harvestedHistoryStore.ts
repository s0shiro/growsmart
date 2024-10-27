import { DateRange } from 'react-day-picker'
import { create } from 'zustand'

type CropCategory = 'All' | 'Rice' | 'Corn' | 'High Value'

interface HarvestedCropsState {
  dateRange: DateRange
  currentPage: number
  activeTab: CropCategory
  setDateRange: (dateRange: DateRange) => void
  setCurrentPage: (page: number) => void
  setActiveTab: (tab: CropCategory) => void
  clearDateRange: () => void
}

export const useHarvestedCropsStore = create<HarvestedCropsState>((set) => ({
  dateRange: { from: undefined, to: undefined },
  currentPage: 1,
  activeTab: 'All',
  setDateRange: (dateRange) => set({ dateRange }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setActiveTab: (tab) => set({ activeTab: tab, currentPage: 1 }),
  clearDateRange: () => set({ dateRange: { from: undefined, to: undefined } }),
}))
