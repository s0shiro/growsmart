import { getAllStandingCropBasedOnUserProgramType } from '@/lib/crop'
import { PlantingRecord, StandingTable } from '../(components)/StandingTable'

export default async function PlantingRecordsPage() {
  const standingData = await getAllStandingCropBasedOnUserProgramType()

  // First cast to unknown, then to PlantingRecord[]
  const typedData = standingData as unknown as PlantingRecord[]

  return (
    <div>
      <h1 className='text-4xl font-bold mb-8'>Standing Records</h1>
      <StandingTable data={typedData} />
    </div>
  )
}
