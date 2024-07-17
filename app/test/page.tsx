'use client'

import useUser from '@/hooks/useUser'
import useUserWithRole from '@/hooks/useUserWithRole'

const page = () => {
  const user = useUser()

  const { data, isFetching } = useUserWithRole()

  if (isFetching) {
    return <p>Loading pa timang...</p>
  }

  return (
    <div>
      <p>{user.data?.id}</p>
      {Array.isArray(data)
        ? data.map((user) => (
            <div key={user.id}>
              <p>{user.email}</p>
              <div>
                {user.permissions.map((permission, index) => (
                  <div key={index}>
                    <div>{permission.id}</div>
                    <div>{permission.role}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        : null}
    </div>
  )
}

export default page
