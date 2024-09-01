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

const UserRole = async () => {
  const currentUser = await getCurrentUser()
  const user = await getUserRole(currentUser?.id ?? '')
  const farmers = await getListOfFarmers(currentUser?.id ?? '')
  const farmersCount = await getCountOfFarmers(currentUser?.id ?? '')
  // const plantingRecords = await getAllPlantingRecords(
  //   'f4ca3f7d-f57b-47b7-91df-78c08d19fa93',
  // )

  // const harvestRecord = await fetchHarvestByPlantingRecordId(
  //   '70968d8a-3fde-4a6b-a53c-fc141681a852',
  // )

  const inspectionPlantings = await getInspectionStatusRecords(
    '925d0d23-e96b-4263-bfdd-86d2f62830e4',
  )

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

  console.log(inspectionPlantings)
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
