'use server'

import { createClient } from '@/utils/supabase/server'

interface InspectionData {
  plantingID: string
  farmerID: string
  technicianID: string // New field
  dateOfInspection: string
  damagedArea: number
  damageSeverity: string
  damageType: string
  growthStage: string
  isPriority: boolean
  findings?: string
  visitationImages?: string[]
}

export const recordInspection = async (data: InspectionData) => {
  const supabase = createClient()

  const inspectionData = {
    planting_id: data.plantingID,
    farmer_id: data.farmerID,
    technician_id: data.technicianID,
    date: data.dateOfInspection,
    damaged: data.damagedArea,
    damage_severity: data.damageSeverity,
    damage_type: data.damageType,
    growth_stage: data.growthStage,
    is_priority: data.isPriority,
    findings: data.findings,
    visitation_images: data.visitationImages,
  }

  const { error } = await supabase.from('inspections').insert([inspectionData])

  if (error) {
    console.error('Supabase error:', error.message)
    throw error
  }
}

export const getInspectionsByPlantingID = async (plantingID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inspections')
    .select(
      `
      *,
      planting_records(status),
      users!technician_id (
        full_name,
        email,
        job_title
      )
    `,
    )
    .eq('planting_id', plantingID)
    .order('date', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    throw error
  }

  return data
}
