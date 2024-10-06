'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/auth'
import React, { useState } from 'react'
import { useTransition } from 'react'
import { ArrowRight, Mail, Lock } from 'lucide-react'

const initState = { message: null as string | null }

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const [formState, setFormState] = useState<{ message: string | null }>(initState)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await login({ message: formState.message, formData })
      setFormState(result)
      setErrorMessage(result.message)
    })
  }

  return (
    <div className='flex min-h-screen bg-background'>
      <div className='m-auto w-full max-w-md p-8 bg-card rounded-[var(--radius)] shadow-xl'>
        <div className='mb-8 text-center'>
          <Image
            src='/no-bg.png'
            alt='GrowSmart Logo'
            width={80}
            height={80}
            className='mx-auto mb-4'
          />
          <h1 className='text-3xl font-bold text-primary'>GrowSmart</h1>
          <p className='text-sm text-muted-foreground mt-2'>
            Log in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-sm font-medium text-foreground'
            >
              Email
            </Label>
            <div className='relative'>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='m@example.com'
                required
                className='pl-10 w-full bg-background'
              />
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5' />
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-foreground'
              >
                Password
              </Label>
              <Link
                href='/forgot-password'
                className='text-xs text-primary hover:text-primary/80'
              >
                Forgot password?
              </Link>
            </div>
            <div className='relative'>
              <Input
                id='password'
                type='password'
                name='password'
                placeholder='••••••••'
                required
                className='pl-10 w-full bg-background'
              />
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5' />
            </div>
          </div>
          <Button
            type='submit'
            className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
            disabled={isPending}
          >
            {isPending ? (
              'Logging in...'
            ) : (
              <>
                Login <ArrowRight className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>

          {errorMessage && (
            <p className='p-4 text-center bg-destructive/10 text-destructive rounded-[var(--radius)] text-sm'>
              {errorMessage}
            </p>
          )}

          {searchParams?.message && (
            <p className='p-4 text-center bg-destructive/10 text-destructive rounded-[var(--radius)] text-sm'>
              {searchParams.message}
            </p>
          )}
        </form>
        {/*<div className='mt-8 text-center text-sm text-muted-foreground'>*/}
        {/*  Don&apos;t have an account?{' '}*/}
        {/*  <Link*/}
        {/*    href='/signup'*/}
        {/*    className='font-medium text-primary hover:text-primary/80'*/}
        {/*  >*/}
        {/*    Sign up*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}