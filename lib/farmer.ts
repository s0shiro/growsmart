'use server'

import { createClient } from '@/utils/supabase/server'
import { getCurrentUser } from './users'

// Types for the new structure
type AssociationPosition = {
  associationId: string
  position: string
}

type FarmerCreateData = {
  firstname: string
  lastname: string
  gender: string
  municipality: string
  barangay: string
  phoneNumber: string
  associationPositions: AssociationPosition[]
  avatar?: string | null
  landsize?: number
  rsbsaNumber?: number
}

export const createNewFarmer = async (data: FarmerCreateData) => {
  const supabase = createClient()
  const user = await getCurrentUser()

  // Check for duplicates based on name and barangay
  const { data: existingFarmer } = await supabase
    .from('technician_farmers')
    .select()
    .eq('firstname', data.firstname)
    .eq('lastname', data.lastname)
    .eq('barangay', data.barangay)
    .single()

  if (existingFarmer) {
    throw new Error(
      `Farmer ${data.firstname} ${data.lastname} from ${data.barangay} already exists.`,
    )
  }

  // If RSBSA is provided, check for duplicates
  if (data.rsbsaNumber) {
    const { data: existingRSBSA } = await supabase
      .from('technician_farmers')
      .select()
      .eq('rsbsa_number', data.rsbsaNumber)
      .single()

    if (existingRSBSA) {
      throw new Error(
        `Farmer with RSBSA number ${data.rsbsaNumber} already exists.`,
      )
    }
  }

  // Proceed with creation
  const { data: farmer, error: farmerError } = await supabase
    .from('technician_farmers')
    .insert({
      user_id: user?.id || '',
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      municipality: data.municipality,
      barangay: data.barangay,
      phone: data.phoneNumber,
      land_size: data.landsize,
      avatar: data.avatar || null,
      ...(data.rsbsaNumber && { rsbsa_number: data.rsbsaNumber }), // Only include if provided
    })
    .select()
    .single()

  if (farmerError) {
    console.error('Error creating farmer:', farmerError.message)
    throw farmerError
  }

  // Insert association positions
  if (data.associationPositions.length > 0) {
    const { error: associationsError } = await supabase
      .from('farmer_associations')
      .insert(
        data.associationPositions.map((ap) => ({
          farmer_id: farmer.id,
          association_id: ap.associationId,
          position: ap.position,
        })),
      )

    if (associationsError) {
      console.error('Error creating associations:', associationsError.message)
      throw associationsError
    }
  }

  return farmer
}

export const getListOfFarmers = async (userId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('technician_farmers')
    .select(
      `
        *,
        farmer_associations (
          id,
          position,
          association: association (
            id,
            name
          )
        ),
        assistance_count:farmer_assistance(count)
      `,
    )
    .eq('user_id', userId)
    .order('firstname', { ascending: true })

  if (error) {
    console.error('Supabase error:', error.message)
    throw error
  }

  // Transform data to include assistance count
  const transformedData =
    data?.map((farmer) => ({
      ...farmer,
      assistance_count: farmer.assistance_count?.[0]?.count ?? 0,
    })) || []

  return transformedData
}

export const getOneFarmer = async (farmerId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('technician_farmers')
    .select(
      `
          *,
          planting_records (
            *,
            crop_categories (name),
            crops (name),
            crop_varieties (name),
            harvest_records (
              profit,
              created_at
            )
          ),
          farmer_associations (
            position,
            association (
              id,
              name
            )
          )
        `,
    )
    .eq('id', farmerId)
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
    throw error
  }

  // Calculate total profits
  const totalProfits =
    data.planting_records?.reduce((sum, record) => {
      const harvestProfits =
        record.harvest_records?.reduce(
          (harvestSum, harvest) => harvestSum + (harvest.profit || 0),
          0,
        ) || 0
      return sum + harvestProfits
    }, 0) || 0

  // Return data with total profits
  return {
    ...data,
    totalProfits,
  }
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
    .select(
      `
      *,
      farmer_associations (
        id,
        position,
        association: association (
          id,
          name
        )
      )
    `,
    )
    .order('created_at', { ascending: false }) // Orders by created_at in descending order

  if (error) {
    console.error('Supabase error:', error.message)
    return [] // Return an empty array or handle the error as needed
  }

  return data
}

export const updateFarmer = async (farmerId: string, data: any) => {
  const supabase = createClient()

  // First verify the farmer exists
  const { data: exists, error: existsError } = await supabase
    .from('technician_farmers')
    .select('id')
    .eq('id', farmerId)
    .single()

  if (existsError || !exists) {
    throw new Error(`Farmer with ID ${farmerId} not found`)
  }

  // Update with modified query
  const { data: updatedFarmer, error: updateError } = await supabase
    .from('technician_farmers')
    .update({
      firstname: data.firstname,
      lastname: data.lastname,
      gender: data.gender,
      municipality: data.municipality,
      barangay: data.barangay,
      phone: data.phone,
      land_size: data.landsize,
      rsbsa_number: data.rsbsa_number || null,
    })
    .eq('id', farmerId)
    .select(
      `
        id,
        firstname,
        lastname,
        gender,
        municipality,
        barangay,
        phone,
        rsbsa_number,
        created_at,
        farmer_associations (
          id,
          position,
          association (
            id,
            name
          )
        )
      `,
    )
    .single()

  if (updateError) {
    console.error('Supabase update error:', updateError)
    throw updateError
  }

  if (!updatedFarmer) {
    throw new Error('Failed to update farmer')
  }

  return updatedFarmer
}
