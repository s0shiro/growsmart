import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const getCurrentUser = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    throw error
  }

  return data.user
}

const useUserSession = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userSession'],
    queryFn: getCurrentUser,
  })

  return { user, isLoading, error }
}

export default useUserSession
