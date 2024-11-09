import { readUserSession } from '@/lib/actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from './(components)/dashboard-client'

export default async function DashboardPage() {
  const { data: sessionData } = await readUserSession()

  if (!sessionData.user) {
    console.log('No session found, redirecting to login')
    redirect('/login')
  }

  const supabase = createClient()

  // Join users and permissions tables
  const { data: userData, error } = await supabase
    .from('users')
    .select(
      `
      *,
      permissions (
        role,
        status
      )
    `,
    )
    .eq('id', sessionData.user.id)
    .single()

  if (error) {
    console.error('Database Error:', error)
    throw error
  }

  if (!userData) {
    console.error('No user data found for ID:', sessionData.user.id)
    redirect('/login')
  }

  // Use permissions from database or fallback to session metadata
  const role =
    userData.permissions?.[0]?.role ??
    sessionData.user.user_metadata?.role ??
    'user'
  const status =
    userData.permissions?.[0]?.status ??
    sessionData.user.user_metadata?.status ??
    'resigned'

  // Structure data for client component
  const serializableUserData = {
    id: userData.id,
    email: userData.email,
    fullName: userData.full_name,
    jobTitle: userData.job_title,
    avatarUrl: userData.avatar_url,
    role,
    status,
  }

  return <DashboardClient userData={serializableUserData} />
}
