// import 'server-only'
'use server'
import { createClient } from '../utils/supabase/server'
import { cache } from 'react'
import { QueryData } from '@supabase/supabase-js'

export const getCurrentUser = cache(async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
})

export const getUserRole = async (userId: string) => {
  const supabase = createClient()

  const userRoleQuery = supabase
    .from('users')
    .select(`id, email, permissions(id, user_id, role)`)
    .eq('id', userId) // Filter to only include the user with the matching userId

  type UserRole = QueryData<typeof userRoleQuery>

  const { data, error } = await userRoleQuery

  if (error) throw error

  const userRole: UserRole = data

  return data
}
