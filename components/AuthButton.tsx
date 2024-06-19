import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from './ui/button'

const DashboardButton = () => {
  return (
    <Button asChild>
      <Link href='/dashboard' className='px-6 py-2.5 text-sm font-semibold'>
        Dashboard
      </Link>
    </Button>
  )
}

export const AuthButtons = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return <DashboardButton />
  }

  return (
    <div className='flex items-center justify-center mt-10 gap-x-6'>
      <Button asChild>
        <Link href='/login' className='px-6 py-2.5 text-sm font-semibold'>
          Login
        </Link>
      </Button>
      <Button asChild variant='outline'>
        <Link
          href='/signup'
          className='px-6 py-2 text-sm font-semibold leading-6'
        >
          Sign Up
        </Link>
      </Button>
    </div>
  )
}
