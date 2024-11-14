'use server'

import { createClient } from '@/utils/supabase/server'

export const getAllDamagesDuringVisitation = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inspections')
    .select(
      `*, planting_records(crop_categoryId(name), crop_type(name), variety(name)), technician_farmers(firstname, lastname)`,
    )
    .gt('damaged', 0) // Add this line to filter damages greater than 0
    .order('damaged', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return null // Explicitly return null on error
  }
  return data
}

export const getCalculatedDamagesOfPlantingRecord = async (
  plantingId: string,
) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inspections')
    .select('damaged, planting_records(area_planted)')
    .eq('planting_id', plantingId)

  const { data: plantingData, error: plantingError } = await supabase
    .from('planting_records')
    .select('area_planted')
    .eq('id', plantingId)
    .single()

  if (error || plantingError) {
    console.error('Supabase error:', error?.message || plantingError?.message)
    return null
  }

  // If no inspections data, return only area_planted from plantingData
  if (!data?.length) {
    return {
      total_damaged: null,
      area_planted: plantingData?.area_planted || null,
      remaining_area: null,
    }
  }

  // Calculate values when inspections exist
  const totalDamaged = data.reduce(
    (sum, record) => sum + (record.damaged || 0),
    0,
  )

  const areaPlanted = data[0].planting_records?.area_planted

  if (!areaPlanted) {
    console.error('Area planted is undefined')
    return null
  }

  return {
    total_damaged: totalDamaged,
    area_planted: areaPlanted,
    remaining_area: areaPlanted - totalDamaged,
  }
}

//getting the damages per month
export const getDamagesPerMonth = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inspections')
    .select('damaged, date, planting_records(location_id(municipality))')
    .gt('damaged', 0)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  // Initialize damages per municipality
  const municipalityDamages = {
    Boac: 0,
    Buenavista: 0,
    Gasan: 0,
    Mogpog: 0,
    'Santa Cruz': 0,
    Torrijos: 0,
  }

  // Aggregate damages
  data?.forEach((inspection) => {
    const municipality = inspection.planting_records?.location_id?.municipality
    if (municipality && municipality in municipalityDamages) {
      municipalityDamages[municipality] += inspection.damaged
    }
  })

  // Convert to array format if needed
  const result = Object.entries(municipalityDamages).map(
    ([municipality, total]) => ({
      municipality,
      total,
    }),
  )

  return result
}
