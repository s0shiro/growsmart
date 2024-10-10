'use server'

import { createClient } from '@/utils/supabase/server'

export const getAllDamagesDuringVisitation = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('inspections')
    .select(
      `*, planting_records(crop_categoryId(name), crop_type(name), variety(name)), technician_farmers(firstname, lastname)`,
    )
    .order('damaged', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return null // Explicitly return null on error
  }
  return data
}
