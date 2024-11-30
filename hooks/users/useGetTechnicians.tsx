import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

interface Technician {
  user_id: string
  users: {
    full_name: string
    email: string
    avatar_url: string
    job_title: string
  }
  status: string
}

export const useGetTechnicians = () => {
  const supabase = createClient()

  return useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
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
        .eq('status', 'active')
        .returns<Technician[]>()

      if (error) {
        throw new Error(`Failed to fetch technicians: ${error.message}`)
      }

      return data || []
    },
  })
}
