'use server'

import { createClient } from '@/utils/supabase/server'
import { getCurrentUser } from './users '

export const createNewFarmer = async (data: {
  firstname: string
  lastname: string
  gender: string
  municipality: string
  barangay: string
  phoneNumber: string
}) => {
  const supabase = createClient()
  const user = await getCurrentUser()

  const { error } = await supabase.from('technician_farmers').insert({
    user_id: user?.id,
    firstname: data.firstname,
    lastname: data.lastname,
    gender: data.gender,
    municipality: data.municipality,
    barangay: data.barangay,
    phone: data.phoneNumber,
  })

  if (error) {
    console.error('Supabase error:', error.message)
  }
}

export const getListOfFarmers = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('technician_farmers')
    .select()
    .eq('user_id', userId)

  if (error) {
    console.error('Supabase error:', error.message)
  }

  return data
}
