'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './users '

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
