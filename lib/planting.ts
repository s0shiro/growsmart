'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './users '

type PlantingRecordData = {
  farmerId: string | undefined
  cropType: string
  variety: string
  plantingDate: string
  fieldLocation: string
  areaPlanted: string
  quantity: string
  expenses: string
  harvestDate: string
  status: string
  cropCategory: string
  landType?: string
}

type PlantingRecord = {
  user_id: string
  farmer_id: string
  crop_type: string
  variety: string
  planting_date: string
  field_location: string
  area_planted: number
  quantity: number
  expenses: number
  harvest_date: string
  status: string
  crop_categoryId: string
  land_type?: string
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
    expenses: parseFloat(data.expenses),
    harvest_date: data.harvestDate,
    status: data.status,
    crop_categoryId: data.cropCategory,
    land_type: data.landType,
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
    .select(`*, crops (name), crop_varieties (name)`)
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
    .select(`
      *,
      technician_farmers (id, firstname, lastname),
      crops (name), crop_varieties (name)
    `) // Selects all fields; you can specify fields if needed
    .or('status.eq.harvest') // Filters records where status is "planted" or "standing"
    .eq('user_id', userID) // Filters records by the provided userID
    .order('created_at', { ascending: false }) // Orders the records by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  return data // Returns the queried records
}

export const getInspectionStatusRecords = async (userID: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('planting_records')
    .select(`
      *,
      technician_farmers (id, firstname, lastname),
      crops (name), crop_varieties (name)
    `)
    .eq('status', 'inspection')
    .eq('user_id', userID)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error.message);
    return;
  }

  return data;
};

export const getHarvestedStatusRecords = async (userID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select(`
      *,
      technician_farmers (id, firstname, lastname),
      crops (name), crop_varieties (name), harvest_records(harvest_date)
    `) // Selects all fields; you can specify fields if needed
    .eq('status', 'harvested') // Filters records where status is "harvested"
    .eq('user_id', userID) // Filters records by the provided userID
    .order('created_at', { ascending: false }) // Orders the records by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  return data // Returns the queried records
}

export const getPlantingRecordById = async (plantingID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('planting_records')
    .select('*, technician_farmers (firstname, lastname, avatar), crop_categories(name), crops (name), crop_varieties (name), inspections(*)')
    .eq('id', plantingID)
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
    return
  }

  return data
}


