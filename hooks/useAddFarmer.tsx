import { createNewFarmer } from '@/lib/farmer'
import { Database, Tables } from '@/utils/types/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Farmer = Tables<'technician_farmers'>

export function useAddFarmer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewFarmer,
    onSuccess: () => {
      // Invalidate and refetch the farmers query to update the UI
      queryClient.invalidateQueries({ queryKey: ['farmers'] })
      // queryClient.setQueryData<Farmer[]>(['farmers'], (oldFarmers) => [
      //   ...oldFarmers,
      //   newFarmers,
      // ])
    },
  })
}
