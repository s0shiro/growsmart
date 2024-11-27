import { getAllHarvestedCropBasedOnUserProgramType } from '@/lib/crop'
import { PlantingRecord, StandingTable } from '../(components)/StandingTable'

export default async function PlantingRecordsPage() {
  const harvestedData = await getAllHarvestedCropBasedOnUserProgramType()

  // First cast to unknown, then to PlantingRecord[]
  const typedData = harvestedData as unknown as PlantingRecord[]

  return (
    <div>
      <h1 className='text-4xl font-bold mb-8'>Harvested Records</h1>
      <StandingTable data={typedData} />
    </div>
  )
}
