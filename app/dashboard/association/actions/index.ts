// /app/actions/addAssociation.js
'use server'

import { createClient } from '@/utils/supabase/server'
import { unstable_noStore } from 'next/cache'

type Association = {
  id: string
  name: string
  description: string
  created_at: string
  memberCount: number
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

  // Single query using count and group by
  const { data, error } = await supabase
    .from('association')
    .select(
      `
        *,
        memberCount:farmer_associations(count)
      `,
    )
    .returns<Association[]>()

  if (error) {
    console.error('Error fetching associations:', error.message)
    throw error
  }

  // Transform the data to include member count
  const associationsWithCounts = data.map((association) => ({
    ...association,
    memberCount: association.memberCount || 0,
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
