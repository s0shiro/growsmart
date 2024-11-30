import { getTechnicianStats } from '@/lib/technician'
import { useQuery } from '@tanstack/react-query'

export const useTechnicianProfile = (technicianId: string) => {
  return useQuery({
    queryKey: ['technician-profile', technicianId],
    queryFn: async () => await getTechnicianStats(technicianId),
  })
}
