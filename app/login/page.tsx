import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const login = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Invalid email or password.')
    }
    redirect('/')
  }
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='w-full px-8 mx-auto mt-4 sm:max-w-md'>
        <form
          action={login}
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
          <Button className='px-4 py-2 mb-2'>Sign In</Button>

          {searchParams?.message && (
            <p className='p-4 mt-4 text-center bg-foreground/10 text-foreground'>
              {searchParams.message}
            </p>
          )}
        </form>

        <Link
          href='/forgot-password'
          className='text-sm text-indigo-400 no-underline rounded-md'
        >
          Forgot Password?
        </Link>

        <br />
        <br />

        <Link
          href='/signup'
          className='text-sm no-underline rounded-md text-foreground'
        >
          Don't have an Account? Sign Up
        </Link>
      </div>
    </div>
  )
}
