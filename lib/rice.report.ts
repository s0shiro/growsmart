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
) => {
  const supabase = createClient()

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

  // Rename location_id to location in the returned data
  const renamedData = data.map((record) => {
    const { location_id, ...rest } = record
    return { ...rest, location: location_id }
  })

  return renamedData
}

export const getTotalHarvestedRiceCropsData = async (
  selectedMunicipality: string,
) => {
  const supabase = createClient()

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

  if (selectedMunicipality) {
    query = query.eq('location_id.municipality', selectedMunicipality)
  }

  const { data, error } = await query

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  // Rename location_id to location in the returned data
  const renamedData = data.map((record) => {
    const { location_id, ...rest } = record
    return { ...rest, location: location_id }
  })

  return renamedData
}
