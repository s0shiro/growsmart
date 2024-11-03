'use server'

import { createClient } from '@/utils/supabase/server'
import { endOfMonth, formatISO, startOfMonth } from 'date-fns'

// -get inspection high value crops (not on this current month)
// -get the inspection high-value crops this month
// -to data (TOTAL)

// -get the production of that certain high value crop in this month

export const getHighValueInspectionData = async () => {
  const supabase = createClient()

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId!inner(name), crop_type(id, name), variety(name), area_planted, planting_date, category_specific->>classification, status, remarks`,
    )
    .eq('crop_categoryId.name', 'high-value')
    .eq('status', 'inspection')
    .order('planting_date', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return { historical: null, currentMonth: null, production: null }
  }

  if (!data?.length) {
    return { historical: null, currentMonth: null, production: null }
  }

  const currentMonthData = data.filter((record) => {
    const plantingDate = new Date(record.planting_date)
    return plantingDate >= monthStart && plantingDate <= monthEnd
  })

  const historicalData = data.filter((record) => {
    const plantingDate = new Date(record.planting_date)
    return plantingDate < monthStart
  })

  // Get production data
  let productionData = null

  const highValueCrops = await getHighValueCropsId()
  if (highValueCrops) {
    for (const crop of highValueCrops) {
      const harvestedData = await getHarvestedDataOfHighValueCropCurrentMonth(
        crop.id,
      )

      if (harvestedData?.length) {
        const totalYieldQuantityKg = harvestedData.reduce((sum, record) => {
          return sum + (record.harvest_records[0].yield_quantity || 0)
        }, 0)
        const totalYieldQuantityMT = totalYieldQuantityKg / 1000

        productionData = {
          id: crop.id,
          name: crop.name,
          yield_quantity: totalYieldQuantityMT,
        }
        break
      }
    }
  }

  return {
    existing: historicalData.length ? historicalData : null,
    currentMonth: currentMonthData.length ? currentMonthData : null,
    production: productionData,
  }
}

export const getHarvestedDataOfHighValueCropCurrentMonth = async (
  cropId: string,
) => {
  const supabase = createClient()

  const now = new Date()
  const monthStart = formatISO(startOfMonth(now))
  const monthEnd = formatISO(endOfMonth(now))

  const { data, error } = await supabase
    .from('planting_records')
    .select(
      `crop_categoryId!inner(name),
      crop_type!inner(id, name),
      harvest_records!inner(
        area_harvested,
        yield_quantity,
        harvest_date
      )`,
    )
    .eq('crop_categoryId.name', 'high-value')
    .eq('crop_type.id', cropId)
    .eq('status', 'harvested')
    .gte('harvest_records.harvest_date', monthStart)
    .lte('harvest_records.harvest_date', monthEnd)

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  if (!data?.length) {
    return null
  }

  return data
}

async function getHighValueCropsId() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('crops')
    .select(`id, name, category_id!inner(name)`)
    .eq('category_id.name', 'high-value')

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  if (!data?.length) {
    return null
  }

  return data
}
