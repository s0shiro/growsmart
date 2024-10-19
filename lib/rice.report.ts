'use server'

import { createClient } from '@/utils/supabase/server'

export const getPlantingRiceCropForTheCurrentMonth = async () => {
  const supabase = createClient()

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
  const startOfNextMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1,
  )

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId!inner(name), crop_type(name), variety(name), farmer_id(id, firstname, lastname), area_planted, planting_date, category_specific, location_id(barangay, municipality, province)`,
    )
    .eq('crop_categoryId.name', 'rice')
    .gte('planting_date', startOfMonth.toISOString())
    .lt('planting_date', startOfNextMonth.toISOString())
    .order('field_location', { ascending: true })

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  if (data.length === 0) {
    return null
  }

  return data
}
