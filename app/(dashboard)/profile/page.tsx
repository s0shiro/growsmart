import { createClient } from '@/utils/supabase/server'

async function page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <div>Welcome, {user?.email}</div>
}

export default page
