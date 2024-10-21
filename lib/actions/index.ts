'use server'

import { createSupbaseServerClientReadOnly } from '@/utils/supabase/server'
import { User } from '@supabase/supabase-js'

export async function readUserSession() {
  const supabase = await createSupbaseServerClientReadOnly()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { data: { user } }
}

// import { create } from 'zustand'

// interface UserState {
//   user: User | null
// }

// export const userUserStore = create<UserState>()((set) => ({
//   user: null
// }))
