// hooks/assistance/useAssistanceRecords.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

export default function useAssistanceRecords(associationId: string) {
  return useQuery({
    queryKey: ['assistance', associationId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('association_assistance')
        .select('*')
        .eq('association_id', associationId)
        .order('date_given', { ascending: false })

      if (error) throw error
      return data
    },
  })
}
