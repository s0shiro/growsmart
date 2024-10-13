'use server'

import { createClient } from '@/utils/supabase/server'

export const recordInspection = async (data: {
  plantingID: string
  farmerID: string
  dateOfInspection: string
  damagedQuantity: number
  damagedReason: string
  findings?: string
}) => {
  const supabase = createClient()

  const inspectionData = {
    planting_id: data.plantingID,
    farmer_id: data.farmerID,
    date: data.dateOfInspection,
    findings: data.findings,
    damaged: data.damagedQuantity,
    damaged_reason: data.damagedReason,
  }

  const { error } = await supabase.from('inspections').insert([inspectionData])

  if (error) {
    console.error('Supabase error:', error.message)
  }
}

export const getInspectionsByPlantingID = async (plantingID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inspections')
    .select('*, planting_records(status)')
    .eq('planting_id', plantingID)

  console.log(data)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

//get standing corn crops
export const getStandingCornCrops = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId(name), crop_type(name), field_location, area_planted, planting_date, remarks, farmer_id(firstname, lastname)`,
    )
    .eq('status', 'inspection')
    .eq('crop_categoryId.name', 'corn') // Filter by crop category name

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  // Filter out records where crop_categoryId is null
  const filteredData = data.filter((record) => record.crop_categoryId !== null)

  return filteredData
}
