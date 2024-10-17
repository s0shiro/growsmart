'use server'

import { createClient } from '@/utils/supabase/server'

export const getHarvestedCornCropsData = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId!inner(name), crop_type(name), variety(name), field_location, farmer_id(firstname, lastname), harvest_records(area_harvested, yield_quantity, harvest_date)`,
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

export const getStandingCornCrops = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId!inner(name), crop_type(name), field_location, area_planted, planting_date, remarks, farmer_id(firstname, lastname)`,
    )
    .eq('status', 'inspection')
    .eq('crop_categoryId.name', 'corn') // Filter by crop category name

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

//get the planted corn crops for the current month
export const getMonthlyCornPlantingAccomplishment = async () => {
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
      `crop_categoryId!inner(name), crop_type(name), variety(name), field_location, farmer_id(firstname, lastname), area_planted, planting_date`,
    )
    .eq('crop_categoryId.name', 'corn')
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
