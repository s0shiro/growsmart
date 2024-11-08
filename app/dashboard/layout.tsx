import { readUserSession } from '@/lib/actions'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from './(components)/dashboard-layout-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data } = await readUserSession()

  if (!data.user) {
    redirect('/login')
  }

  // Extract only the necessary, serializable data
  const serializableUserData = {
    id: data.user.id,
    email: data.user.email,
    fullName: data.user.user_metadata.full_name,
    role: data.user.user_metadata.role,
    status: data.user.user_metadata.status,
    lastSignInAt: data.user.last_sign_in_at,
    avatarUrl: data.user.user_metadata.avatarUrl,
    jobTitle: data.user.user_metadata.jobTitle,
  }

  return (
    <DashboardLayoutClient userData={serializableUserData}>
      {children}
    </DashboardLayoutClient>
  )
}
