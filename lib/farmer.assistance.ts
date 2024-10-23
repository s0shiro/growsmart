'use server'

import { createClient } from '@/utils/supabase/server'

type AssistanceData = {
  farmerID: string
  assistanceType: string
  description: string
  quantity: number
  dateReceived: string
}

export const recordAssistance = async (data: AssistanceData) => {
  const supabase = createClient()

  const assistanceData = {
    farmer_id: data.farmerID,
    assistance_type: data.assistanceType,
    description: data.description,
    quantity: data.quantity,
    date_received: data.dateReceived,
  }

  const { error } = await supabase
    .from('farmer_assistance')
    .insert([assistanceData])

  if (error) {
    console.error('Supabase error:', error.message)
  }
}

export const getAssistancesByFarmerID = async (farmerID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('farmer_assistance')
    .select('*')
    .eq('farmer_id', farmerID)

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data
}
