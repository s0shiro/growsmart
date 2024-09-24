import { getInspectionStatusRecords } from '@/lib/planting'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const initInspections = {
  id: '',
  created_at: '',
  farmer_id: '',
  crop_type: '',
  variety: '',
  planting_date: '',
  field_location: '',
  area_planted: 0,
  quantity: 0,
  weather_condition: '',
  expenses: 0,
  harvest_date: '',
  technician_id: '',
  status: '',
}

const useReadInspections = () => {
  return useQuery({
    queryKey: ['inspections'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const inspections = await getInspectionStatusRecords(
          data.session.user.id,
        )
        return inspections
      }
      return initInspections
    },
  })
}

export default useReadInspections
