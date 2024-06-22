import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Signup({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const supabase = createClient()

    if (password !== confirmPassword) {
      return redirect('/signup?message=Password do not match')
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/signup?message=Could not authenticateuser.')
    } else {
      return redirect(
        `/confirm?message=Check email(${email} to verify sign up.`,
      )
    }
  }

  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='w-full px-8 mx-auto mt-4 sm:max-w-md'>
        <form
          action={signUp}
          className='flex flex-col justify-center flex-1 w-full gap-2 mb-4 animate-in text-foreground'
        >
          <label className='text-md' htmlFor='email'>
            Email
          </label>
          <input
            className='px-4 py-2 mb-6 border rounded-md bg-inherit'
            name='email'
            placeholder='you@example.com'
            required
          />
          <label className='text-md' htmlFor='password'>
            Password
          </label>
          <input
            className='px-4 py-2 mb-6 border rounded-md bg-inherit'
            type='password'
            name='password'
            placeholder='••••••••'
            required
          />
          <label className='text-md' htmlFor='password'>
            Confirm Password
          </label>
          <input
            className='px-4 py-2 mb-6 border rounded-md bg-inherit'
            type='password'
            name='confirmPassword'
            placeholder='••••••••'
            required
          />
          <Button className='px-4 py-2 mb-2'>Sign up</Button>

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
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  )
}
