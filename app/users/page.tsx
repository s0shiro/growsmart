import { getCurrentUser, getUserRole } from '@/lib/users '

const UserRole = async () => {
  const currentUser = await getCurrentUser()
  const user = await getUserRole(currentUser?.id ?? '')

  console.log(user)

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
