import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'

export default async function LogOut() {
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
      <div>
        <form action={singOut}>
          <Button variant='ghost'>
            <LogOutIcon size={15} />
          </Button>
          {/* <button className='px-4 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover'>
            Logout
          </button> */}
        </form>
      </div>
    )
  )
}
