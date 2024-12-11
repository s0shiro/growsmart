// /app/actions/addAssociation.js
'use server'

import { createClient } from '@/utils/supabase/server'
import { unstable_noStore } from 'next/cache'

interface Association {
  id: string
  name: string
  created_at: string
  memberCount: { count: number }[]
  assistanceCount: { count: number }[]
}

export async function addAssociation(data: { name: string }) {
  // Create the Supabase client on the server side
  const supabase = createClient()

  // Insert the data into the "association" table
  const result = await supabase.from('association').insert({
    name: data.name,
  })

  // Handle errors and return the result
  if (result.error) {
    return { error: result.error }
  }

  return { success: true }
}

export async function readAssociations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('association')
    .select(
      `
          *,
          memberCount:farmer_associations(count),
          assistanceCount:association_assistance(count)
        `,
    )
    .returns<Association[]>()

  if (error) {
    console.error('Error fetching associations:', error.message)
    throw error
  }

  // Transform the data to include both counts
  const associationsWithCounts = data.map((association) => ({
    ...association,
    memberCount: association.memberCount?.[0]?.count || 0,
    assistanceCount: association.assistanceCount?.[0]?.count || 0,
  }))

  return associationsWithCounts
}

export async function readAssociationById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('association')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
    return { error: error.message }
  }

  return data
}

export const getFarmerCountByAssociation = async (
  associationId: string,
): Promise<number> => {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('technician_farmers')
    .select('*', { count: 'exact' })
    .eq('association_id', associationId)

  if (error) {
    console.error('Supabase error:', error.message)
    return 0
  }

  return count ?? 0
}

export const getAssociationDetails = async (associationId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('farmer_associations')
    .select(
      `id, farmer_id, association_id(name), position, technician_farmers(*)`,
    ) // Assuming there is a relationship to fetch user details
    .eq('association_id', associationId)

  if (error) {
    console.error('Error fetching association details:', error.message)
    return null
  }

  return data
}

export async function addAssistance(formData: FormData) {
  const supabase = createClient()

  const assistanceData = {
    association_id: formData.get('association_id'),
    assistance_type: formData.get('assistance_type'),
    description: formData.get('description'),
    amount: parseFloat(formData.get('amount') as string),
    date_given: formData.get('date_given'),
    unit:
      formData.get('unit') ||
      getDefaultUnit(formData.get('assistance_type') as string),
  }

  const { error } = await supabase
    .from('association_assistance')
    .insert([assistanceData])

  if (error) throw error

  return { success: true }
}

function getDefaultUnit(assistanceType: string): string {
  const units = {
    'Financial Aid': '₱',
    Equipment: 'pcs',
    Seeds: 'kg',
    Other: '',
  }
  return units[assistanceType as keyof typeof units] || ''
}
