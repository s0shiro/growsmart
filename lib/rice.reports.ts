'use server'

import { createClient } from '@/utils/supabase/server'

export const getHarvestedRiceCropsData = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId!inner(name), crop_type(name), variety(name), farmer_id(firstname, lastname), harvest_records(area_harvested, yield_quantity, harvest_date), location_id(barangay, municipality, province)`,
    )
    .eq('status', 'harvested')
    .eq('crop_categoryId.name', 'rice') // Filter by crop category name
    .filter('category_specific', 'cs', '{"waterSupply":"irrigated"}') // Filter by water supply

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  // Get the current month and year
  const currentMonth = new Date().getMonth() + 1 // Months are 0-based in JavaScript
  const currentYear = new Date().getFullYear()

  // Filter out records where harvest_date is in the current month
  const filteredData = data.filter((record) => {
    const harvestDate = new Date(record.harvest_records[0]?.harvest_date)
    return (
      harvestDate.getMonth() + 1 === currentMonth &&
      harvestDate.getFullYear() === currentYear
    )
  })

  return filteredData.length > 0 ? filteredData : null
}
