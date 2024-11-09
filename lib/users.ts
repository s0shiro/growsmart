// import 'server-only'
'use server'
import { createClient, createSupabaseAdmin } from '../utils/supabase/server'
import { cache } from 'react'
import { QueryData } from '@supabase/supabase-js'
import { createClient as createClientVerify } from '@supabase/supabase-js'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

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

// Helper function to update avatar URL in Supabase
export const updateUserAvatar = async (userId: string, avatarUrl: string) => {
  const supabase = createClient()

  // Get current authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('Not authenticated')

  // Security check: only allow users to update their own avatar
  if (user.id !== userId) {
    throw new Error('Unauthorized: Can only update your own avatar')
  }

  // Update avatar in public.users table
  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)

  const { data, error: metaDataUpdate } = await supabase.auth.updateUser({
    data: { avatarUrl: avatarUrl },
  })

  if (updateError) throw updateError
  if (metaDataUpdate) throw metaDataUpdate

  return true
}

// verifyPassword function
export async function verifyPassword(email: string, password: string) {
  // Create a new Supabase client specifically for verification
  const supabaseAuthClient = createClientVerify(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  if (typeof window !== 'undefined') {
    throw new Error('This function must be executed server-side')
  }

  try {
    // Attempt sign in without persisting session
    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
      email,
      password,
    })

    // Return validation result without affecting main session
    if (error) {
      return { valid: false }
    }

    return { valid: true }
  } catch (error) {
    console.error('Password verification error:', error)
    return { valid: false }
  }
}

const profileSchema = z.object({
  full_name: z.string().min(2),
  job_title: z.string().min(2),
})

export async function updateProfile(
  formData: z.infer<typeof profileSchema>,
  userId: string,
) {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('users')
      .update(formData)
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/dashboard/profile')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update profile' }
  }
}
