import { getCountOfFarmers, getListOfFarmers, getOneFarmer } from '@/lib/farmer'
import {
  fetchHarvestByPlantingRecordId,
  getPlantingRecordWithHarvest,
} from '@/lib/harvests'
import {
  getAllPlantingRecords,
  getHarvestedStatusRecords,
  getInspectionStatusRecords,
  getPlantedStatusRecords,
  getPlantingRecordsByCurrentUser,
} from '@/lib/planting'
import { getCurrentUser, getUserRole } from '@/lib/users '
import HarvestDetails from '../test/Harvest'
import HarvestDetailsTest from '../test/Harvest'
import { readUserSession } from '@/lib/actions'
import {
  getAssociationDetails,
  readAssociationById,
} from '../dashboard/association/actions'
import { getInspectionsByPlantingID } from '@/lib/inspection'
import {
  getAllCategoriesWithCropsAndVarieties,
  getAllCropCategory,
  getCropNameById,
  getCropsByCategory,
  getVarietiesByCrop,
} from '@/lib/crop'
import { getFarmerNameById } from '@/lib/association'

const UserRole = async () => {
  const currentUser = await getCurrentUser()
  //   const crops = await getCropsByCategory('8a9b1e79-ac83-417d-92ab-a9ae19c9a4f3')

  const varieties = await getVarietiesByCrop(
    'c06c4b48-040a-4205-92ea-4736952e6d28',
  )

  //   const cropName = await getCropNameById('c06c4b48-040a-4205-92ea-4736952e6d28')

  const allCrops = await getAllCategoriesWithCropsAndVarieties()
  // const plantingRecords = await getAllPlantingRecords(
  //   'f4ca3f7d-f57b-47b7-91df-78c08d19fa93',
  // )

  // const harvestRecord = await fetchHarvestByPlantingRecordId(
  //   '70968d8a-3fde-4a6b-a53c-fc141681a852',
  // )

  //   const inspectionPlantings = await getInspectionStatusRecords(
  //     '925d0d23-e96b-4263-bfdd-86d2f62830e4',
  //   )

  //   const { id, email } = user[0]
  //   const { role, user_id } = user[0].permissions[0]

  //   const plantedStatus = await getPlantedStatusRecords(id)

  //   const harvestedStatus = await getHarvestedStatusRecords(id)

  //   const plantingRecordWithHarvest = await getPlantingRecordWithHarvest(
  //     '8bd72222-b659-4980-93dc-e73fd6fbd6bf',
  //   )

  //   const associationDetails = await readAssociationById(
  //     '26a6f119-156e-43fc-9f0e-013b2ece408a',
  //   )

  //   const userData = await readUserSession()

  // console.log(`User email: ${email}`)

  // console.log('------------------------------------------')
  // // console.log(farmers)

  // // console.log(plantingRecords)

  // // console.log(currentUser)

  // console.log(`farmers count: ${farmersCount}`)
  // console.log('------------------------------------------')

  // console.log(`Planted status Data: ${JSON.stringify(plantedStatus)}`)

  // console.log('------------------------------------------')

  // console.log(`Planted status Data: ${JSON.stringify(harvestedStatus)}`)

  // console.log(`Harvest Record: ${JSON.stringify(harvestRecord)}`)
  //

  //   console.log(JSON.stringify(userData))

  //   console.log(plantingRecordWithHarvest)

  //   console.log(associationDetails)

  //   console.log(inspectionPlantings)

  console.log(JSON.stringify(allCrops))

  //   console.log(inspectionsHistory)
  return (
    <div>
      {/* <div>Association Details</div>
      <ul>
        {associationDetails?.map((member) => (
          <li key={member.id}>
            <p>{member.firstname}</p>
          </li>
        ))}
      </ul> */}
    </div>
  )
}

export default UserRole
