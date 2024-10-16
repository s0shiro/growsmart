'use server'

import { createClient } from '@/utils/supabase/server'

export const getHarvestedCornCropsData = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId(name), crop_type(name), variety(name), field_location, farmer_id(firstname, lastname), harvest_records(area_harvested, yield_quantity, harvest_date)`,
    )
    .eq('status', 'harvested')
    .eq('crop_categoryId.name', 'corn') // Filter by crop category name

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  // Get the current month and year
  const currentMonth = new Date().getMonth() + 1 // Months are 0-based in JavaScript
  const currentYear = new Date().getFullYear()

  // Filter out records where crop_categoryId is null and harvest_date is in the current month
  const filteredData = data.filter((record) => {
    if (record.crop_categoryId === null) return false
    const harvestDate = new Date(record.harvest_records[0]?.harvest_date)
    return (
      harvestDate.getMonth() + 1 === currentMonth &&
      harvestDate.getFullYear() === currentYear
    )
  })

  return filteredData.length > 0 ? filteredData : null
}
