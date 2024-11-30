import { getURL } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ForgotPasswordForm from './ForgotPassword'

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const confirmReset = async (formData: FormData) => {
    'use server'

    const origin = getURL()
    const email = formData.get('email') as string
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    })

    if (error) {
      return redirect('/forgot-password?message=Could not authenticate user')
    }

    return redirect(
      '/confirm?message=Password Reset link has been sent to your email address',
    )
  }

  return (
    <ForgotPasswordForm
      confirmReset={confirmReset}
      message={searchParams?.message}
    />
  )
}
