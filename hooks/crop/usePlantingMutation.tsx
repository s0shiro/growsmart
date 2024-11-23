// hooks/usePlantingMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

export const usePlantingMutation = () => {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (plantingID: string) => {
      const { data, error } = await supabase
        .from('planting_records')
        .update({ status: 'harvest' })
        .eq('id', plantingID)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['inspections'] })
    },
    onError: (error) => {
      console.error('Error updating planting record:', error)
    },
  })
}
