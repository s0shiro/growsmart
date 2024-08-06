import { useQuery } from '@tanstack/react-query'
import { getListOfFarmers } from '@/lib/farmer'
import { createClient } from '@/utils/supabase/client'

const initFarmer = {
  id: '',
  firstname: '',
  lastname: '',
  gender: '',
  municipality: '',
  barangay: '',
  phone: '',
}

export default function useFetchFarmers() {
  return useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        const farmers = await getListOfFarmers(data.session.user.id)
        return farmers
      }
      return [initFarmer]
    },
  })
}
