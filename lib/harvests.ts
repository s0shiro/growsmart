'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './users '
import { QueryData } from '@supabase/supabase-js'
import { parse } from 'path'

interface HarvestData {
  farmerId: string | undefined
  plantingId: string | undefined
  harvestDate: string
  yieldQuantity: string
  profit: string
  areaHarvested: string
  damagedQuantity: string
  damagedReason: string
}

interface HarvestRecord {
  user_id: string
  farmer_id: string
  planting_id: string
  harvest_date: string
  yield_quantity: number
  profit: number
  area_harvested: number
  damaged_quantity: number
  damaged_reason: string
}

export const addHarvest = async (data: HarvestData) => {
  const user = await getCurrentUser()
  const supabase = createClient()

  const harvestRecord: HarvestRecord = {
    user_id: user?.id || '',
    farmer_id: data.farmerId || '',
    planting_id: data.plantingId || '',
    harvest_date: data.harvestDate,
    yield_quantity: parseFloat(data.yieldQuantity),
    profit: parseFloat(data.profit),
    area_harvested: parseFloat(data.areaHarvested),
    damaged_quantity: parseFloat(data.damagedQuantity),
    damaged_reason: data.damagedReason,
  }

  const { error } = await supabase
    .from('harvest_records')
    .insert([harvestRecord])

  if (error) {
    console.error('Supabase error:', error.message)
  }

  revalidatePath('/dashboard/records')
}

export const fetchHarvestByPlantingRecordId = async (
  plantingRecordId: string,
) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('harvest_records')
    .select('*')
    .eq('planting_id', plantingRecordId)
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  return data
}

export const getPlantingRecordWithHarvest = async (plantingID: string) => {
  const supabase = createClient()

  const plantingRecordQuery = supabase
    .from('planting_records')
    .select(
      `crop_type, variety, planting_date, weather_condition, expenses, field_location, harvests_report(harvest_date, yield_quantity, profit, damaged_quantity, damaged_reason, id, planting_id, farmer_id, added_by, object_id, name)`,
    )
    .eq('id', plantingID) // Filter to only include the record with the matching plantingID
    .single()

  type PlantingRecord = QueryData<typeof plantingRecordQuery>

  const { data, error } = await plantingRecordQuery

  if (error) throw error

  const plantingRecord: PlantingRecord = data

  return data
}