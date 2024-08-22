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

  const { data, error } = await supabase.from('association').select('*')

  if (error) {
    console.error('Supabase error:', error.message)
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
