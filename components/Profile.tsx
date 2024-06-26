'use client'

import useUser from '@/hooks/useUser'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

function Profile() {
  const { isFetching, data } = useUser()

  if (isFetching) {
    return
  }

  return (
    <div>
      <Avatar>
        <AvatarImage src={data.avatarUrl || ''} alt={data.full_name || ''} />
        <AvatarFallback className='font-bold'>
          {data.email ? data.email.charAt(0).toUpperCase() : ''}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Profile
