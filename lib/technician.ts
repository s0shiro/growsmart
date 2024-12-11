'use server'

import { createClient } from '@/utils/supabase/server'

// Add interfaces for nested types
interface Location {
  barangay: string
  municipality: string
}

interface Crop {
  name: string
}

interface TechnicianFarmer {
  firstname: string
  lastname: string
}

interface PlantingRecord {
  id: string
  status: string
  created_at: string
  crops: Crop | null
  technician_farmers: TechnicianFarmer | null
  location_id: Location | null
}

interface TechnicianProfile {
  email: string
  full_name: string
  job_title: string | null
  avatar_url: string | null
}

interface Farmer {
  id: string
  firstname: string
  lastname: string
  avatar: string | null
  rsbsa_number: string
  phone: string | null
}

export const getTechnicianStats = async (technicianId: string) => {
  const supabase = createClient()

  // Get technician profile
  const { data: technician, error: technicianError } = await supabase
    .from('users')
    .select('email, full_name, job_title, avatar_url')
    .eq('id', technicianId)
    .single()

  if (technicianError) {
    console.error('Technician query error:', technicianError)
    throw new Error(`Failed to fetch technician: ${technicianError.message}`)
  }

  // Get farmers assigned to technician
  const { data: farmers, error: farmersError } = await supabase
    .from('technician_farmers')
    .select('id, firstname, lastname, avatar, rsbsa_number, phone')
    .eq('user_id', technicianId)

  if (farmersError) {
    console.error('Farmers query error:', farmersError)
    throw new Error(`Failed to fetch farmers: ${farmersError.message}`)
  }

  // Get planting records with more details
  const { data: plantings, error: plantingsError } = await supabase
    .from('planting_records')
    .select(
      `
      id,
      status,
      created_at,
      crops (name),
      technician_farmers (firstname, lastname),
      location_id (
        barangay,
        municipality
      )
    `,
    )
    .eq('user_id', technicianId)
    .order('created_at', { ascending: false })
    .returns<PlantingRecord[]>()

  if (plantingsError) {
    console.error('Plantings query error:', plantingsError)
    throw new Error(`Failed to fetch plantings: ${plantingsError.message}`)
  }

  const farmersList = farmers || []
  const plantingsList = plantings || []

  return {
    technician: {
      email: technician?.email || '',
      fullName: technician?.full_name || '',
      jobTitle: technician?.job_title || '',
      avatarUrl: technician?.avatar_url || '',
    },
    totalFarmers: farmersList.length,
    activePlantings: plantingsList.filter((p) => p.status === 'active').length,
    harvestedPlantings: plantingsList.filter((p) => p.status === 'harvested')
      .length,
    pendingInspections: plantingsList.filter((p) => p.status === 'inspection')
      .length,
    farmersAssigned: farmersList.map((f) => ({
      id: f.id,
      fullName: `${f.firstname} ${f.lastname}`,
      avatar: f.avatar,
      rsbsaNumber: f.rsbsa_number,
      phone: f.phone,
    })),
    plantingRecords: {
      harvested: plantingsList
        .filter((p) => p.status === 'harvested')
        .map((p) => ({
          id: p.id,
          cropName: p.crops?.name || 'Unknown crop',
          farmer: `${p.technician_farmers?.firstname} ${p.technician_farmers?.lastname}`,
          location: `${p.location_id?.barangay}, ${p.location_id?.municipality}`,
          date: p.created_at,
          status: p.status,
        })),
      pending: plantingsList
        .filter((p) => p.status === 'inspection')
        .map((p) => ({
          id: p.id,
          cropName: p.crops?.name || 'Unknown crop',
          farmer: `${p.technician_farmers?.firstname} ${p.technician_farmers?.lastname}`,
          location: `${p.location_id?.barangay}, ${p.location_id?.municipality}`,
          date: p.created_at,
          status: p.status,
        })),
    },
  }
}
