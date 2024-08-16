'use server'

import { createSupabaseAdmin } from '@/utils/supabase/server'

export async function createMember(data: {
  name: string
  role: 'user' | 'admin'
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

export async function deleteMemberById(id: string) {}

export async function readMembers() {}
