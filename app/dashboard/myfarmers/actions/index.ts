'use server'

import { createClient } from '@/utils/supabase/server'

export const getAssociation = async (associationID: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('association')
    .select('*')
    .eq('id', associationID)
    .single()

  if (error) {
    console.error('Supabase error:', error.message)
  }

  return data
}
