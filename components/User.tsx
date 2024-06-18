import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function User() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const singOut = async () => {
    'use server'

    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }
  return (
    user && (
      <div className='flex items-center gap-4'>
        Hey, {user.email}
        <form action={singOut}>
          <button className='px-4 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover'>
            Logout
          </button>
        </form>
      </div>
    )
  )
}
