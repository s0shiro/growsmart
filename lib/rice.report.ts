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

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  if (data.length === 0) {
    return null
  }

  const sortedData = data.sort((a, b) =>
    a.location_id.barangay.localeCompare(b.location_id.barangay),
  )

  return sortedData
}

export const getHarvestedRiceCropsData = async (
  selectedMunicipality: string,
  selectedType: string,
  startDate: Date,
  endDate: Date,
) => {
  const supabase = createClient()

  // Ensure start date is at the beginning of the day and end date is at the end of the day
  const adjustedStartDate = new Date(startDate)
  adjustedStartDate.setHours(0, 0, 0, 0)
  const adjustedEndDate = new Date(endDate)
  adjustedEndDate.setHours(23, 59, 59, 999)

  let query = supabase
    .from('planting_records')
    .select(
      `
          crop_categoryId (
            name
          ),
          crop_type(
            name
         ),
         variety(
            name
         ),
         farmer_id(
              id,
            firstname,
            lastname),
         category_specific,
          location_id (
            barangay,
            municipality,
            province
          ), harvest_records(
            area_harvested,
            yield_quantity,
            harvest_date)
        `,
    )
    .eq('status', 'harvested')
    .not('crop_categoryId', 'is', null)
    .eq('crop_categoryId.name', 'rice')
    .not('location_id', 'is', null)
    .gte('harvest_records.harvest_date', adjustedStartDate.toISOString())
    .lte('harvest_records.harvest_date', adjustedEndDate.toISOString())

  if (selectedMunicipality) {
    query = query.eq('location_id.municipality', selectedMunicipality)
  }

  if (selectedType === 'upland') {
    query = query.eq('category_specific->>landType', 'upland')
  } else {
    query = query.eq('category_specific->>waterSupply', selectedType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  // Filter out records with empty harvest_records array and ensure strict date adherence
  const filteredData = data.filter((record) => {
    if (record.harvest_records.length === 0) return false
    const harvestDate = new Date(record.harvest_records[0].harvest_date)
    return harvestDate >= adjustedStartDate && harvestDate <= adjustedEndDate
  })

  // Rename location_id to location in the returned data
  const renamedData = filteredData.map((record) => {
    const { location_id, ...rest } = record
    return { ...rest, location: location_id }
  })

  return renamedData
}

export const getTotalHarvestedRiceCropsData = async (
  selectedMunicipality: string,
  startDate: Date,
  endDate: Date,
) => {
  const supabase = createClient()

  // Ensure start date is at the beginning of the day and end date is at the end of the day
  const adjustedStartDate = new Date(startDate)
  adjustedStartDate.setHours(0, 0, 0, 0)
  const adjustedEndDate = new Date(endDate)
  adjustedEndDate.setHours(23, 59, 59, 999)

  let query = supabase
    .from('planting_records')
    .select(
      `
          crop_categoryId (
            name
          ),
          crop_type(
            name
         ),
         variety(
            name
         ),
         farmer_id(
              id,
            firstname,
            lastname),
         category_specific,
          location_id (
            barangay,
            municipality,
            province
          ), harvest_records(
            area_harvested,
            yield_quantity,
            harvest_date)
        `,
    )
    .eq('status', 'harvested')
    .not('crop_categoryId', 'is', null)
    .eq('crop_categoryId.name', 'rice')
    .not('location_id', 'is', null)
    .gte('harvest_records.harvest_date', adjustedStartDate.toISOString())
    .lte('harvest_records.harvest_date', adjustedEndDate.toISOString())

  if (selectedMunicipality) {
    query = query.eq('location_id.municipality', selectedMunicipality)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  // Filter out records with empty harvest_records array and ensure strict date adherence
  const filteredData = data.filter((record) => {
    if (record.harvest_records.length === 0) return false
    const harvestDate = new Date(record.harvest_records[0].harvest_date)
    return harvestDate >= adjustedStartDate && harvestDate <= adjustedEndDate
  })

  // Rename location_id to location in the returned data
  const renamedData = filteredData.map((record) => {
    const { location_id, ...rest } = record
    return { ...rest, location: location_id }
  })

  return renamedData
}
