import { getURL } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    <div>
      <Link
        href='/'
        className='px-4 py-2 m-4 text-sm no-underline rounded-md text-foreground bg-btn-background hover:bg-btn-background-hover'
      >
        Home
      </Link>

      <div className='w-full px-8 mx-auto mt-4 sm:max-w-md'>
        <form
          action={confirmReset}
          className='flex flex-col justify-center flex-1 w-full gap-2 mb-4 animate-in text-foreground'
        >
          <label className='text-md' htmlFor='email'>
            Enter Email Address
          </label>
          <input
            className='px-4 py-2 mb-6 border rounded-md bg-inherit'
            name='email'
            placeholder='you@example.com'
            required
          />

          <button className='px-4 py-2 mb-2 bg-indigo-700 rounded-md text-foreground'>
            Confirm
          </button>

          {searchParams?.message && (
            <p className='p-4 mt-4 text-center bg-foreground/10 text-foreground'>
              {searchParams.message}
            </p>
          )}
        </form>

        <Link
          href='/login'
          className='text-sm no-underline rounded-md text-foreground'
        >
          Remember your password? Sign in
        </Link>
      </div>
    </div>
  )
}
