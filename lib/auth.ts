'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const login = async (prevState: any, formData: FormData) => {
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

export const signUp = async (prevState: any, formData: FormData) => {
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
    return redirect(`/confirm?message=Check email(${email} to verify sign up.`)
  }
}
