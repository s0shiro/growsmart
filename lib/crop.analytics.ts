'use server'

import { createClient } from '@/utils/supabase/server'

interface PlantingRecord {
  planting_date: string
  area_planted: number
  crop_categories: {
    name: string | null
  } | null
}

interface CategoryData {
  [key: string]: {
    name: string
    area: number
  }
}

export const cropAnalytics = async (year: any) => {
  const supabase = createClient()
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  const { data } = await supabase
    .from('planting_records')
    .select(
      `
          *,
          crops(name),
          crop_categories(name),
          harvest_records(yield_quantity, harvest_date)
        `,
    )
    .eq('status', 'harvested')
    .gte('harvest_records.harvest_date', startDate)
    .lte('harvest_records.harvest_date', endDate)

  return data
}

export const categoryAnalytics = async (year: number) => {
  const supabase = createClient()
  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  const { data } = await supabase
    .from('planting_records')
    .select(
      `
          planting_date,
          area_planted,
          crop_categories(name)
        `,
    )
    .gte('planting_date', startDate)
    .lte('planting_date', endDate)
    .returns<PlantingRecord[]>()

  const categoryData: CategoryData = {
    rice: { name: 'Rice', area: 0 },
    corn: { name: 'Corn', area: 0 },
    'high-value': { name: 'High Value', area: 0 },
  }

  data?.forEach((record) => {
    if (record?.crop_categories?.name) {
      const category = record.crop_categories.name.toLowerCase()
      if (category in categoryData) {
        categoryData[category].area += record.area_planted
      }
    }
  })

  // Format areas to 4 decimal places before returning
  return Object.values(categoryData).map((item) => ({
    ...item,
    area: parseFloat(item.area.toFixed(4)),
  }))
}
