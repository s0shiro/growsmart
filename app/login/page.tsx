'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/auth'
import { useFormState } from 'react-dom'
import { useTransition } from 'react'

const initState = { message: null }

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const [formState, action] = useFormState(
    async (state: any, formData: any) => {
      const newState = await login({ message: state.message, formData })
      return newState
    },
    initState,
  )

  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => {
      action(formData)
    })
  }

  return (
    <div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[720px]'>
      <div className='hidden bg-white lg:block'>
        <div className='relative h-full'>
          <Image
            src='/logo.png'
            alt='Image'
            fill
            className='h-full w-full object-cover'
          />
        </div>
      </div>
      <div className='border-l border-gray-300 flex items-center justify-center py-12'>
        <div className='mx-auto grid w-[350px] gap-6'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>GrowSmart</h1>
          </div>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='m@example.com'
                required
              />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='/forgot-password'
                  className='ml-auto inline-block text-sm underline'
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id='password'
                type='password'
                name='password'
                placeholder='••••••••'
                required
              />
            </div>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>

            {searchParams?.message && (
              <p className='p-4 mt-4 text-center bg-foreground/10 text-foreground'>
                {searchParams.message}
              </p>
            )}
          </form>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='underline'>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
