'use server'

import { readUserSession } from '@/lib/actions'
import { createClient, createSupabaseAdmin } from '@/utils/supabase/server'
import { revalidatePath, unstable_noStore } from 'next/cache'

export async function createMember(data: {
  name: string
  role: 'technician' | 'admin'
  status: 'active' | 'resigned'
  email: string
  password: string
  confirm: string
}) {
  const supabase = await createSupabaseAdmin()

  //create account
  const createResult = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      role: data.role,
      full_name: data.name,
      status: data.status,
    },
  })

  if (createResult.error?.message) {
    return JSON.stringify(createResult)
  }

  const userId = createResult.data.user?.id
  if (!userId) {
    return JSON.stringify({ error: { message: 'User ID is undefined' } })
  }

  //   else {
  //     const userResult = await supabase.from('users').insert({
  //       full_name: data.name,
  //       id: createResult.data.user?.id,
  //       email: data.email,
  //     })

  //     if (userResult.error?.message) {
  //       return JSON.stringify(userResult)
  //     } else {
  //       const permessionResult = await supabase.from('permissions').insert({
  //         role: data.role,
  //         user_id: createResult.data.user?.id,
  //         status: data.status,
  //       })

  //       return JSON.stringify(permessionResult)
  //     }
  //   }

  return JSON.stringify({ success: true })
}

export async function updateMemberById(id: string) {
  console.log('update member')
}

export async function deleteMemberById(id: string) {
  const { data: userSession } = await readUserSession()

  if (userSession.user?.user_metadata.role !== 'admin') {
    return JSON.stringify({
      error: { message: 'You are not allowed to perform this action.' },
    })
  }

  const supabaseAdmin = await createSupabaseAdmin()

  const deleteResult = await supabaseAdmin.auth.admin.deleteUser(id)

  if (deleteResult.error?.message) {
    return JSON.stringify(deleteResult)
  }

  //   else {
  //     const supabase = await createClient()

  //     const res = await supabase.from('users').delete().eq('id', id)

  //     return JSON.stringify(res)
  //   }

  // Revalidate the path after successful deletion
  revalidatePath('/dashboard/create-user')
}

export async function readMembers() {
  unstable_noStore()

  const supabase = await createClient()

  return await supabase.from('permissions').select('*, users(*)')
}
