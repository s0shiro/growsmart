'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { readUserSession } from './actions'

export const login = async (prevState: any, formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  // Attempt to sign in the user with email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If there's an error during login, redirect to login with a message
  if (error) {
    return redirect('/login?message=Invalid email or password.')
  }

  // After login, get the updated session data
  const { data: userSession } = await readUserSession()

  if (userSession && userSession.user) {
    // Extract the user metadata
    const status = userSession.user.user_metadata.status

    console.log(status)

    // If the user's status is not active, sign them out and redirect to /unauthorized
    if (status !== 'active') {
      await supabase.auth.signOut()
      return redirect(`/unauthorized?user=${status}`)
    }
  }

  // If everything is fine, redirect to the homepage
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
