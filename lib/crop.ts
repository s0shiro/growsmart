'use server'

import { createClient } from '@/utils/supabase/server'

export const getAllCropCategory = async () => {
  const supabase = createClient()

  const { data, error } = await supabase.from('crop_categories').select('*')

  if (error) {
    console.error('Supabase error:', error.message)
    return 0 // Return 0 or handle the error as needed
  }

  return data
}

export const getCropsByCategory = async (categoryId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('crops')
    .select('*')
    .eq('category_id', categoryId)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

export const getVarietiesByCrop = async (cropId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('crop_varieties')
    .select('*')
    .eq('crop_id', cropId)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}

export const getCropNameById = async (cropId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('crops')
    .select('id, name') // Select only the id and name fields
    .eq('id', cropId) // Match the provided crop ID
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  return data
}
