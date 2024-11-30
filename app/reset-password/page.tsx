import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; code: string }
}) {
  const resetPassword = async (formData: FormData) => {
    'use server'

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      return redirect(
        '/reset-password?message=Passwords do not match. Please try again!',
      )
    }

    const supabase = createClient()

    if (searchParams.code) {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(
        searchParams.code,
      )

      if (error) {
        return redirect(
          `/reset-password?message=Unable to reset password. Link Expired!`,
        )
      }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return redirect(
        '/reset-password?message=Unable to reset password. Please try again!',
      )
    }

    redirect('/login?message=Password reset successfully.')
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <Link
        href='/'
        className='absolute top-4 left-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4'
      >
        ← Back to Home
      </Link>

      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={resetPassword} className='space-y-4'>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                htmlFor='password'
              >
                New Password
              </label>
              <Input
                id='password'
                type='password'
                name='password'
                placeholder='••••••••'
                required
              />
            </div>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                htmlFor='confirmPassword'
              >
                Confirm New Password
              </label>
              <Input
                id='confirmPassword'
                type='password'
                name='confirmPassword'
                placeholder='••••••••'
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Reset Password
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {searchParams?.message && (
            <p className='text-sm text-center text-red-500 dark:text-red-400 w-full'>
              {searchParams.message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
