'use client'
import useFetchMonthlyPlantingCorn from '@/hooks/reports/useFetchMonthlyPlantingCorn'
import CornMonthlyPlantingAccomplishment from './print-report'

const page = () => {
  const { data } = useFetchMonthlyPlantingCorn()
  console.log(data)
  return (
    <div>
      <CornMonthlyPlantingAccomplishment />
    </div>
  )
}

export default page
