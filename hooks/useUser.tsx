import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

interface UserProfile {
  created_at: string
  email: string
  full_name: string
  id: string
}

const initUser: UserProfile = {
  created_at: '',
  email: '',
  full_name: '',
  id: '',
}

const supabase = createClient()

export default function useUser() {
  return useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error('Error fetching authenticated user:', authError)
        return initUser
      }

      if (authData.user) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (userError) {
          console.error('Error fetching user profile:', userError)
          return initUser
        }

        return user as UserProfile
      }

      return initUser
    },
  })
}
