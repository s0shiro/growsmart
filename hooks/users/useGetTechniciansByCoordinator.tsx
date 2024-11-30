import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

interface Technician {
  user_id: string
  users: {
    full_name: string
    email: string
  }
  status: string
}

export const useGetTechniciansByCoordinator = (coordinatorId: string) => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['technicians', coordinatorId],
    queryFn: async () => {
      if (!coordinatorId) throw new Error('Coordinator ID is required')

      const { data, error } = await supabase
        .from('permissions')
        .select(
          `
            user_id,
            status,
            users (
              full_name,
              email,
              avatar_url,
              job_title
            )
          `,
        )
        .eq('role', 'technician')
        .eq('coordinator_id', coordinatorId)

      if (error) throw error
      return data || []
    },
    enabled: !!coordinatorId,
  })
}
