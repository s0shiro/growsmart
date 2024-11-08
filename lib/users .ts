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

export async function getCurrentUserProfile() {
  const supabase = createClient()

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Query profile for the authenticated user
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    throw profileError
  }

  return profile
}
