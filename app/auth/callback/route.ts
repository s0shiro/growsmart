import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth-error`)
    }
  }

  // Redirect to the dashboard after successful signup
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
