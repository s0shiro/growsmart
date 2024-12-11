'use server'

import { createClient } from '@/utils/supabase/server'

interface DateRange {
  from?: Date
  to?: Date
}

// Define municipality type
type Municipality =
  | 'Boac'
  | 'Buenavista'
  | 'Gasan'
  | 'Mogpog'
  | 'Santa Cruz'
  | 'Torrijos'

// Define damages record type using Record utility type
type MunicipalityDamages = Record<Municipality, number>

interface LocationId {
  municipality: Municipality
}

interface PlantingRecord {
  location_id: LocationId
}

interface Inspection {
  damaged: number
  planting_records: PlantingRecord
}

export const getAllDamagesDuringVisitation = async (dateRange?: DateRange) => {
  const supabase = createClient()

  // Default to 6 months ago if no date range provided
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Use provided dates or fallback
  const fromDate = dateRange?.from || sixMonthsAgo
  const toDate = dateRange?.to || new Date()

  const { data, error } = await supabase
    .from('inspections')
    .select(
      `
        *,
        planting_records(
          crop_categoryId(name),
          crop_type(name),
          variety(name)
        ),
        technician_farmers(
          firstname,
          lastname
        )
      `,
    )
    .gt('damaged', 0)
    .gte('date', fromDate.toISOString())
    .lte('date', toDate.toISOString())
    .order('is_priority', { ascending: false })
    .order('damaged', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return null
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
export const getDamagesPerMunicipality = async (dateRange?: DateRange) => {
  const supabase = createClient()

  // Default to 6 months ago if no date range provided
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const fromDate = dateRange?.from || sixMonthsAgo
  const toDate = dateRange?.to || new Date()

  const { data, error } = await supabase
    .from('inspections')
    .select(
      'damaged, date, planting_records!inner(location_id!inner(municipality))',
    )
    .gt('damaged', 0)
    .gte('date', fromDate.toISOString())
    .lte('date', toDate.toISOString())
    .order('created_at', { ascending: false })
    .returns<Inspection[]>()

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  const municipalityDamages: MunicipalityDamages = {
    Boac: 0,
    Buenavista: 0,
    Gasan: 0,
    Mogpog: 0,
    'Santa Cruz': 0,
    Torrijos: 0,
  }

  const isMunicipality = (value: string): value is Municipality => {
    return Object.keys(municipalityDamages).includes(value)
  }

  data?.forEach((inspection) => {
    const municipality = inspection.planting_records.location_id.municipality
    if (isMunicipality(municipality)) {
      municipalityDamages[municipality] += +inspection.damaged.toFixed(4)
    }
  })

  return Object.entries(municipalityDamages).map(([municipality, total]) => ({
    municipality,
    total: +total.toFixed(4),
  }))
}
