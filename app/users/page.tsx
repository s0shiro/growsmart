import { getListOfFarmers, getOneFarmer } from '@/lib/farmer'
import { getCurrentUser, getUserRole } from '@/lib/users '

const UserRole = async () => {
  const currentUser = await getCurrentUser()
  const user = await getUserRole(currentUser?.id ?? '')
  const farmers = await getListOfFarmers(currentUser?.id ?? '')

  const { id, email } = user[0]
  const { role, user_id } = user[0].permissions[0]

  console.log(`User email: ${email}`)
  console.log(farmers)

  return (
    <div>
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
