'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { readUserSession } from './actions'
import { z } from 'zod'

export const login = async (formData: {
  message: string | null
  formData: FormData
}) => {
  const email = formData.formData.get('email') as string
  const password = formData.formData.get('password') as string
  const supabase = createClient()

  // Validation using Zod
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const validationResult = loginSchema.safeParse({ email, password })

  if (!validationResult.success) {
    return { message: 'Invalid email or password format.' }
  }

  // Attempt to sign in the user with email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If there's an error during login, redirect to login with a message
  if (error) {
    return { message: 'Invalid email or password.' }
  }

  // After login, get the updated session data
  const { data: userSession } = await readUserSession()

  if (userSession && userSession.user) {
    // Extract the user metadata
    const status = userSession.user.user_metadata.status

    // If the user's status is not active, sign them out and redirect to /unauthorized
    if (status !== 'active') {
      await supabase.auth.signOut()
      redirect(`/unauthorized?user=${status}`)
      return { message: 'User is not authorized.' }
    }
  }

  // If everything is fine, redirect to the homepage
  redirect('/dashboard')
  return { message: null }
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
      data: {
        role: 'technician',
      },
    },
  })

  if (error) {
    return redirect('/signup?message=Could not authenticateuser.')
  } else {
    return redirect(`/confirm?message=Check email(${email} to verify sign up.`)
  }
}
