import { categoryAnalytics, cropAnalytics } from '@/lib/crop.analytics'
import { useQuery } from '@tanstack/react-query'

export const useCropAnalytics = (year = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ['crop-analytics', year],
    queryFn: async () => cropAnalytics(year),
  })
}

export const useCategoryAnalytics = (year: number) => {
  return useQuery({
    queryKey: ['category-analytics', year],
    queryFn: () => categoryAnalytics(year),
  })
}
