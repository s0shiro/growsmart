import { createNewFarmer } from '@/lib/farmer'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAddFarmer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewFarmer,
    onSuccess: () => {
      // Invalidate and refetch the farmers query to update the UI
      queryClient.invalidateQueries({ queryKey: ['farmers'] })
    },
  })
}
