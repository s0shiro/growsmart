'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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
  const supabase = createClient()

  const { error } = await supabase.from('planting_records').insert({
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
