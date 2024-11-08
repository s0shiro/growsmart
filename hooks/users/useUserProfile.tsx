import { getCurrentUserProfile } from '@/lib/users '
import { useQuery } from '@tanstack/react-query'

// Keep existing getCurrentUserProfile function

export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => await getCurrentUserProfile(),
  })
}

// Usage:
// const { data: profile, isLoading, error } = useCurrentUserProfile()
