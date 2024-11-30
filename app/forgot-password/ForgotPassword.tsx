'use client'

import { useState } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ForgotPasswordFormProps {
  confirmReset: (formData: FormData) => Promise<void>
  message?: string
}

export default function ForgotPasswordForm({
  confirmReset,
  message,
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      await confirmReset(formData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container flex items-center justify-center min-h-screen py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                required
                disabled={isLoading}
              />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending Email...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col items-center space-y-2'>
          {message && (
            <p className='text-sm text-center text-muted-foreground'>
              {message}
            </p>
          )}
          <Link
            href='/login'
            className='text-sm text-center text-muted-foreground hover:underline'
          >
            Remember your password? Sign in
          </Link>
        </CardFooter>
      </Card>
      <Link
        href='/'
        className='absolute top-4 left-4 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 rounded-md'
      >
        <ArrowLeft className='w-4 h-4 mr-2' />
        Back to Home
      </Link>
    </div>
  )
}
