// hooks/useUserProgramType.ts
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

export function useUserProgramType() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['userProgramType'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user?.user_metadata?.programType || null
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    // gcTime: 1000 * 60 * 30, // Inactive data removed after 30 minutes
  })
}
