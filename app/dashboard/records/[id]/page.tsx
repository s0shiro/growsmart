import { getPlantingRecordWithHarvest } from '@/lib/harvests'
import HarvestDetails from './HarvestDetails'

const HarvestDetailsPage = async ({ params }: { params: { id: any } }) => {
  const plantingRecordWithHarvest = await getPlantingRecordWithHarvest(
    params.id,
  )
  return (
    <div>
      {plantingRecordWithHarvest ? (
        <HarvestDetails harvest={plantingRecordWithHarvest} />
      ) : (
        <p>No harvest record available.</p>
      )}
    </div>
  )
}

export default HarvestDetailsPage
