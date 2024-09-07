import { useQuery } from '@tanstack/react-query'
import { readMembers } from '../actions'

export const useReadUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => readMembers(),
  })
}
