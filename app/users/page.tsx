import { getCountOfFarmers, getListOfFarmers, getOneFarmer } from '@/lib/farmer'
import {
  fetchHarvestByPlantingRecordId,
  getPlantingRecordWithHarvest,
} from '@/lib/harvests'
import {
  getAllPlantingRecords,
  getHarvestedStatusRecords,
  getPlantedStatusRecords,
  getPlantingRecordsByCurrentUser,
} from '@/lib/planting'
import { getCurrentUser, getUserRole } from '@/lib/users '
import HarvestDetails from '../test/Harvest'

const UserRole = async () => {
  const currentUser = await getCurrentUser()
  const user = await getUserRole(currentUser?.id ?? '')
  const farmers = await getListOfFarmers(currentUser?.id ?? '')
  const farmersCount = await getCountOfFarmers(currentUser?.id ?? '')
  const plantingRecords = await getAllPlantingRecords(
    'f4ca3f7d-f57b-47b7-91df-78c08d19fa93',
  )

  const harvestRecord = await fetchHarvestByPlantingRecordId(
    '70968d8a-3fde-4a6b-a53c-fc141681a852',
  )

  const { id, email } = user[0]
  const { role, user_id } = user[0].permissions[0]

  const plantedStatus = await getPlantedStatusRecords(id)

  const harvestedStatus = await getHarvestedStatusRecords(id)

  const plantingRecordWithHarvest = await getPlantingRecordWithHarvest(
    '70968d8a-3fde-4a6b-a53c-fc141681a852',
  )

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
  console.log(`data: ${JSON.stringify(plantingRecordWithHarvest)}`)

  return (
    <div>
      <div className='container mx-auto'>
        {plantingRecordWithHarvest ? (
          <HarvestDetails harvest={plantingRecordWithHarvest} />
        ) : (
          <p>No harvest record available.</p>
        )}
      </div>
      <ul>
        {plantedStatus?.map((record, index) => (
          <p key={index}>
            {/* Display desired data from the record. Example: */}
            Record ID: {record.id}, Status: {record.status}, Created At:{' '}
            {record.created_at}
          </p>
        ))}
      </ul>
      {user.map((userInfo) => (
        <div key={userInfo.id}>
          <div>{userInfo.id}</div>
          <div>{userInfo.email}</div>
          <div>
            {userInfo.permissions.map((permission, index) => (
              <div key={index}>
                <div>{permission.id}</div>
                <div>{permission.role}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserRole
