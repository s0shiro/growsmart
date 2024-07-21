'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './users '

export const addPlantingRecord = async (data: {
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
}) => {
  const currentUser = await getCurrentUser()
  const supabase = createClient()

  const { error } = await supabase.from('planting_records').insert({
    technician_id: currentUser?.id,
    farmer_id: data.farmerId,
    crop_type: data.cropType,
    variety: data.variety,
    planting_date: data.plantingDate,
    field_location: data.fieldLocation,
    area_planted: data.areaPlanted,
    quantity: data.quantity,
    weather_condition: data.weatherCondition,
    expenses: data.expenses,
    harvest_date: data.harvestDate,
  })

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

export const getPlantingRecordsByCurrentUser = async () => {
  const currentUser = await getCurrentUser()
  const supabase = createClient()

  if (!currentUser?.id) {
    console.error('No current user found')
    return
  }

  const { data, error } = await supabase
    .from('planting_records')
    .select('*') // Selects all fields; you can specify fields if needed
    .eq('technician_id', currentUser.id) // Filters records where technician_id matches the current user's ID
    .order('created_at', { ascending: false }) // Orders the records by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  return data // Returns the queried records
}
