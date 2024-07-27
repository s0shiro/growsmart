'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './users '
import { QueryData } from '@supabase/supabase-js'

interface HarvestData {
  farmerId: string | undefined
  plantingId: string | undefined
  harvestDate: string
  yieldQuantity: string
  profit: string
}

interface HarvestRecord {
  user_id: string
  farmer_id: string
  planting_id: string
  harvest_date: string
  yield_quantity: number
  profit: number
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
      `planting_date, weather_condition, expenses, field_location, harvest_records(harvest_date, yield_quantity, profit)`,
    )
    .eq('id', plantingID) // Filter to only include the record with the matching plantingID
    .single()

  type PlantingRecord = QueryData<typeof plantingRecordQuery>

  const { data, error } = await plantingRecordQuery

  if (error) throw error

  const plantingRecord: PlantingRecord = data

  return data
}
