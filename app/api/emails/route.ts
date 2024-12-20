import { createSupabaseAdmin } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import GrowsmartWelcomeEmail from '@/emails/signup-email'
import { getURL } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const {
      name,
      jobTitle,
      role,
      status,
      email,
      password,
      avatarUrl,
      programType,
      coordinatorId,
    } = await request.json()
    const origin = getURL()
    const supabase = createSupabaseAdmin()

    // Create user with Supabase Auth
    const { data: userData, error: signUpError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: {
          full_name: name,
          jobTitle,
          role,
          status,
          avatarUrl,
          // Only include programType if role is program coordinator
          ...(role === 'program coordinator' && { programType }),
          ...(role === 'technician' && coordinatorId && { coordinatorId }),
        },
      })

    if (signUpError) throw signUpError

    if (!userData.user) throw new Error('User creation failed')

    // Generate signup link for email verification
    const { data: signupLinkData, error: signupLinkError } =
      await supabase.auth.admin.generateLink({
        type: 'signup',
        email,
        password,
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })

    if (signupLinkError) throw signupLinkError

    // Send email
    await resend.emails.send({
      from: 'Growsmart <noreply@nielmascarinas.me>',
      to: email,
      subject: 'Welcome to Growsmart!',
      react: GrowsmartWelcomeEmail({
        name,
        signupLink: signupLinkData.properties.action_link,
      }),
    })

    return NextResponse.json({
      message: 'User created and invitation sent successfully',
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Failed to create user', error: (error as Error).message },
      { status: 500 },
    )
  }
}
