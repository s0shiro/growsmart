import { getPlantingRecordWithHarvest } from '@/lib/harvests'
import HarvestDetails from './HarvestDetails'

const page = async ({ params }: { params: { id: any } }) => {
  const plantingRecordWithHarvest = await getPlantingRecordWithHarvest(
    params.id,
  )
  return (
    <div>
      <div className='container mx-auto'>
        {plantingRecordWithHarvest ? (
          <HarvestDetails harvest={plantingRecordWithHarvest} />
        ) : (
          <p>No harvest record available.</p>
        )}
      </div>
    </div>
  )
}

export default page
