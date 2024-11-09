import { readUserSession } from '@/lib/actions'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from './(components)/dashboard-layout-client'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: sessionData } = await readUserSession()

  if (!sessionData.user) {
    console.log('No session found, redirecting to login')
    redirect('/login')
  }

  const supabase = createClient()

  // Query user data with permissions
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
    redirect('/login')
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

  const serializableUserData = {
    id: userData.id,
    email: userData.email,
    fullName: userData.full_name,
    jobTitle: userData.job_title,
    avatarUrl: userData.avatar_url,
    role,
    status,
    lastSignInAt: userData.created_at,
  }

  return (
    <DashboardLayoutClient userData={serializableUserData}>
      {children}
    </DashboardLayoutClient>
  )
}
