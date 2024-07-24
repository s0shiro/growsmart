'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './users '

interface PlantingRecordData {
  farmerId: string | undefined
  cropType: string
  variety: string
  plantingDate: string
  fieldLocation: string
  areaPlanted: string
  quantity: string
  weatherCondition: string
  expenses: string
  harvestDate: string
  status: string
}

interface PlantingRecord {
  user_id: string
  farmer_id: string
  crop_type: string
  variety: string
  planting_date: string
  field_location: string
  area_planted: number
  quantity: number
  weather_condition: string
  expenses: number
  harvest_date: string
  status: string
}

export const addPlantingRecord = async (data: PlantingRecordData) => {
  const user = await getCurrentUser()
  const supabase = createClient()

  const plantingRecord: PlantingRecord = {
    user_id: user?.id || '',
    farmer_id: data.farmerId || '',
    crop_type: data.cropType,
    variety: data.variety,
    planting_date: data.plantingDate,
    field_location: data.fieldLocation,
    area_planted: parseFloat(data.areaPlanted),
    quantity: parseFloat(data.quantity),
    weather_condition: data.weatherCondition,
    expenses: parseFloat(data.expenses),
    harvest_date: data.harvestDate,
    status: data.status,
  }

  const { error } = await supabase
    .from('planting_records')
    .insert([plantingRecord])

  if (error) {
    console.error('Supabase error:', error.message)
  }

  revalidatePath('/dashboard/farmers')
}

export const getAllPlantingRecords = async (farmerID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select()
    .eq('farmer_id', farmerID)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
  }

  return data
}

export const getPlantingRecordsByCurrentUser = async (userID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select('*') // Selects all fields; you can specify fields if needed
    .eq('user_id', userID) // Filters records where technician_id matches the current user's ID
    .order('created_at', { ascending: false }) // Orders the records by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  return data // Returns the queried records
}

//update status
export const updateStatusWhenAddHarvest = async (plantingID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .update({ status: 'harvested' })
    .eq('id', plantingID)

  if (error) {
    console.error('Error updating planting record status:', error)
  } else {
    console.log('Planting record status updated successfully:', data)
  }
}

export const getPlantedStatusRecords = async (userID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select('*') // Selects all fields; you can specify fields if needed
    .eq('status', 'planted') // Filters records where status is "planted"
    .eq('user_id', userID) // Filters records by the provided userID
    .order('created_at', { ascending: false }) // Orders the records by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  return data // Returns the queried records
}
