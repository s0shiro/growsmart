import { getUserRole } from '@/lib/users'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const initUser = {
  created_at: '',
  email: '',
  full_name: '',
  id: '',
  permissions: {
    role: '',
  },
}

export default function useUserWithRole() {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const userRole = await getUserRole(data.session.user.id)
        return userRole
      }
      return initUser
    },
  })
}
