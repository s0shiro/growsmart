'use server'

import { readUserSession } from '@/lib/actions'
import { createClient, createSupabaseAdmin } from '@/utils/supabase/server'
import { revalidatePath, unstable_noStore } from 'next/cache'

//Creating account for admin
export async function createMember(data: {
  name: string
  role: 'technician' | 'admin' | 'program coordinator'
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

//Updating user for admin only
//TODO: Also update the metadata of the user
export async function updateMemberBasicById(
  id: string,
  data: {
    full_name: string
    jobTitle?: string
  },
) {
  const supabase = await createSupabaseAdmin()

  try {
    const [userUpdate, metadataUpdate] = await Promise.all([
      // Update users table with full_name only
      supabase
        .from('users')
        .update({ full_name: data.full_name, job_title: data.jobTitle })
        .eq('id', id),

      // Update auth metadata with both fields
      supabase.auth.admin.updateUserById(id, {
        user_metadata: {
          full_name: data.full_name,
          jobTitle: data.jobTitle,
        },
      }),
    ])

    if (userUpdate.error) throw userUpdate.error
    if (metadataUpdate.error) throw metadataUpdate.error

    revalidatePath('/dashboard/users')
    return JSON.stringify({ success: true })
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    })
  }
}

export async function updateMemberAdvanceAndMetadataById(
  permissionId: string,
  userId: string,
  data: {
    role: 'admin' | 'technician'
    status: 'active' | 'resigned'
  },
) {
  const supabase = await createClient()
  const supabaseAdmin = await createSupabaseAdmin()

  // Update permissions table
  const permissionsRes = await supabase
    .from('permissions')
    .update(data)
    .eq('id', permissionId)

  // Update user metadata
  const metadataRes = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      role: data.role,
      status: data.status,
    },
  })

  revalidatePath('/dashboard/create-user')

  return JSON.stringify({
    permissionsRes,
    metadataRes,
  })
}

export async function updateAccountById(
  user_id: string,
  data: {
    password?: string | undefined
    confirm?: string | undefined
  },
) {
  const supabaseAdmin = await createSupabaseAdmin()

  const { data: userSession } = await readUserSession()

  if (userSession.user?.user_metadata.role !== 'admin') {
    return JSON.stringify({
      error: { message: 'You are not allowed to do this!' },
    })
  }

  if (!data.password) {
    return JSON.stringify({
      error: { message: 'Password is required!' },
    })
  }

  const updateObject = { password: data.password }

  const updateResult = await supabaseAdmin.auth.admin.updateUserById(
    user_id,
    updateObject,
  )

  if (updateResult.error?.message) {
    return JSON.stringify(updateResult)
  } else {
    revalidatePath('/dashboard/member')
    return JSON.stringify({ message: 'Password updated successfully.' })
  }
}

//Deleting user by admin
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

//Select users
export async function readMembers() {
  unstable_noStore()

  const supabase = await createClient()

  const data = await supabase.from('permissions').select('*, users(*)')

  return data
}
