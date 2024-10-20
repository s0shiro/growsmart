import {
  getPlantedStatusRecords,
  getPlantingRecordsByCurrentUser,
} from '@/lib/planting'
import { createClient } from '@/utils/supabase/client'
import { useQuery } from '@tanstack/react-query'

const initPlantings = {
  id: '',
  created_at: '',
  farmer_id: '',
  crop_type: '',
  variety: '',
  planting_date: '',
  area_planted: 0,
  quantity: 0,
  weather_condition: '',
  expenses: 0,
  harvest_date: '',
  technician_id: '',
}

const useFetchPlantings = () => {
  return useQuery({
    queryKey: ['plantings'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()

      //dati etong getAllPlantingRecords()

      if (data.session?.user) {
        const farmers = await getPlantedStatusRecords(data.session.user.id)
        return farmers
      }
      return initPlantings
    },
  })
}

export default useFetchPlantings
