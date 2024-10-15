'use server'

import { createClient } from '@/utils/supabase/server'

export const getHarvestedCornCropsData = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId(name), crop_type(name), field_location, farmer_id(firstname, lastname), harvest_records(area_harvested, yield_quantity)`,
    )
    .eq('status', 'harvested')
    .eq('crop_categoryId.name', 'corn') // Filter by crop category name

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  // Filter out records where crop_categoryId is null
  const filteredData = data.filter((record) => record.crop_categoryId !== null)

  return filteredData
}
