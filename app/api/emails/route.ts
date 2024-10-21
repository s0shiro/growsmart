import { createSupabaseAdmin } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { headers } from 'next/headers'
import GrowsmartWelcomeEmail from '@/emails/signup-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, role, status, email, password } = await request.json()
    const origin = headers().get('origin')
    const supabase = createSupabaseAdmin()

    // Create user with Supabase Auth
    const { data: userData, error: signUpError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          role,
          status,
        },
      })

    if (signUpError) throw signUpError

    if (!userData.user) throw new Error('User creation failed')

    // Generate magic link for email verification
    const { data: magicLinkData, error: magicLinkError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })

    if (magicLinkError) throw magicLinkError

    // Send email
    await resend.emails.send({
      from: 'Growsmart <noreply@nielmascarinas.me>',
      to: email,
      subject: 'Welcome to Growsmart!',
      react: GrowsmartWelcomeEmail({
        name,
        signupLink: magicLinkData.properties.action_link,
      }),
    })

    return NextResponse.json({
      message: 'User created and invited successfully',
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Failed to create user', error: (error as Error).message },
      { status: 500 },
    )
  }
}
