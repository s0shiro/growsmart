// /app/actions/addAssociation.js
'use server'

import { createClient } from '@/utils/supabase/server'
import { unstable_noStore } from 'next/cache'

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
  unstable_noStore()

  const supabase = await createClient()

  const { data: associations, error: associationsError } = await supabase
    .from('association')
    .select('*')

  if (associationsError) {
    console.error('Supabase error:', associationsError.message)
    return { error: associationsError.message }
  }

  const associationsWithCounts = await Promise.all(
    associations.map(async (association) => {
      const { count, error: countError } = await supabase
        .from('technician_farmers')
        .select('*', { count: 'exact' })
        .eq('association_id', association.id)

      if (countError) {
        console.error('Supabase error:', countError.message)
        return { ...association, memberCount: 0 }
      }

      return { ...association, memberCount: count ?? 0 }
    }),
  )

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
    .from('technician_farmers')
    .select(`*, association(name)`) // Assuming there is a relationship to fetch user details
    .eq('association_id', associationId)

  if (error) {
    console.error('Error fetching association details:', error.message)
    return null
  }

  return data
}
