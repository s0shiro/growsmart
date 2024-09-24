import { useQuery } from '@tanstack/react-query'
import { readMembers } from '../../app/dashboard/users/actions'

export const useReadUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => readMembers(),
  })
}
