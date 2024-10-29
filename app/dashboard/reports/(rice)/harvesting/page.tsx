import { getHarvestedRiceCropsData } from '@/lib/rice.reports'
import HarvestingReportTable from './HarvestingReportTable'

const page = async () => {
  const data = await getHarvestedRiceCropsData()
  console.log(data)
  return (
    <div>
      <HarvestingReportTable />
    </div>
  )
}

export default page
