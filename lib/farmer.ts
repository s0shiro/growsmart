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
  const user = await getCurrentUser()

  const supabase = createClient()

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
