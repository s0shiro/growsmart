import { useQuery } from '@tanstack/react-query'
import { readMembers } from '../../app/dashboard/users/actions'

interface User {
  id: string
  full_name: string
  email: string
  job_title?: string
}

interface Member {
  id: string
  role: 'admin' | 'technician' | 'program coordinator'
  status: 'active' | 'resigned'
  users: User
}

export const useReadUsers = () => {
  return useQuery<Member[], Error>({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await readMembers()
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data as Member[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })
}
