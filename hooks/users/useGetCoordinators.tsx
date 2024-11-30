// Create a new hook: useGetCoordinators.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

export const useGetCoordinators = () => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['coordinators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select(
          'user_id, users(full_name, email, program_type(name), avatar_url, job_title)',
        )
        .eq('role', 'program coordinator')
        .eq('status', 'active')

      if (error) throw error
      return data
    },
  })
}
