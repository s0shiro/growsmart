'use server'

import { createClient } from '@/utils/supabase/server'

export const getAssociationNameById = async (associationId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('association')
    .select('id, name') // Select only the id and name fields
    .eq('id', associationId) // Match the provided crop ID
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
    return null
  }

  return data
}
