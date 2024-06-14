import { createClient } from '@/utils/supabase/server'

export default async function User() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    user && (
      <div className='flex items-center gap-4'>
        Hey, {user.email}
        <form>
          <button className='px-4 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover'>
            Logout
          </button>
        </form>
      </div>
    )
  )
}
