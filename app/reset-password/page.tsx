import Header from '@/components/Header/Header'
import { createClient } from '@/utils/supabase/server'

import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; code: string }
}) {
  const resetPassword = async (formData: FormData) => {
    'use server'

    const password = formData.get('password') as string
    const supabase = createClient()

    if (searchParams.code) {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(
        searchParams.code,
      )

      if (error) {
        return redirect(
          `/reset-password?message= Unable to reset password. Link Expired!`,
        )
      }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return redirect(
        '/reset-password?message=Unable to reset password. Please try again!',
      )
    }

    redirect('/login?message=Password reset succesfully.')
  }

  return (
    <div>
      <Header />

      <Link
        href='/'
        className='px-4 py-2 m-4 text-sm no-underline rounded-md text-foreground bg-btn-background hover:bg-btn-background-hover'
      >
        Home
      </Link>

      <div className='w-full px-8 mx-auto mt-4 sm:max-w-md'>
        <form
          action={resetPassword}
          className='flex flex-col justify-center flex-1 w-full gap-2 mb-4 animate-in text-foreground'
        >
          <label className='text-md' htmlFor='password'>
            New Password
          </label>
          <input
            className='px-4 py-2 mb-6 border rounded-md bg-inherit'
            type='password'
            name='password'
            placeholder='••••••••'
            required
          />
          <label className='text-md' htmlFor='password'>
            Confirm New Password
          </label>
          <input
            className='px-4 py-2 mb-6 border rounded-md bg-inherit'
            type='password'
            name='confirmPassword'
            placeholder='••••••••'
            required
          />
          <button className='px-4 py-2 mb-2 bg-indigo-700 rounded-md text-foreground'>
            Reset
          </button>

          {searchParams?.message && (
            <p className='p-4 mt-4 text-center bg-foreground/10 text-foreground'>
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
