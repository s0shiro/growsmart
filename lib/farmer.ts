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
  association_id: string
  position: string
  avatar: string | undefined
  rsbsaNumber: number
}) => {
  const supabase = createClient()
  const user = await getCurrentUser()

  const { error } = await supabase.from('technician_farmers').insert({
    user_id: user?.id || '',
    firstname: data.firstname,
    lastname: data.lastname,
    gender: data.gender,
    municipality: data.municipality,
    barangay: data.barangay,
    phone: data.phoneNumber,
    association_id: data.association_id,
    position: data.position,
    avatar: data.avatar,
    rsbsa_number: data.rsbsaNumber,
  })

  if (error) {
    console.error('Supabase error:', error.message)
  }
}

export const getListOfFarmers = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('technician_farmers')
    .select(
      `
      *,
      association(
        id,
        name
      )
    `,
    )
    .eq('user_id', userId)
    .order('firstname', { ascending: true }) // Orders by lastname in ascending order

  if (error) {
    console.error('Supabase error:', error.message)
  }

  return data
}

export const getOneFarmer = async (farmerId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('technician_farmers')
    .select(
      `*, planting_records(*, crop_categories(name), crops(name), crop_varieties(name)), association(name)`,
    )
    .eq('id', farmerId)
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
  }

  return data
}

export const getCountOfFarmers = async (userId: string): Promise<number> => {
  const supabase = createClient()
  const { data, error, count } = await supabase
    .from('technician_farmers')
    .select('user_id', { count: 'exact' })
    .eq('user_id', userId)

  if (error) {
    console.error('Supabase error:', error.message)
    return 0 // Return 0 or handle the error as needed
  }

  return count ?? 0 // Return count or 0 if count is null
}

export const getAllFarmers = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('technician_farmers')
    .select(`*, association(name)`)
    .order('created_at', { ascending: false }) // Orders by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return [] // Return an empty array or handle the error as needed
  }

  return data
}
