'use client'

import useFetchHarvestedRice from '@/hooks/reports/useFetchHarvestedRice'
import HarvestingReportTable from './HarvestingReportTable'

const page = () => {
  const { data, error } = useFetchHarvestedRice()
  return (
    <div>
      <HarvestingReportTable />
    </div>
  )
}

export default page
