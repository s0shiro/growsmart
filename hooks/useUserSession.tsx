import { readUserSession } from '@/lib/actions'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'

const useUserSession = () => {
  return useQuery({
    queryKey: ['userSession'],
    queryFn: async () => await readUserSession,
  })
}

export default useUserSession
