'use client'

import useUser from '@/hook/useUser'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import Link from 'next/link'
import { Button } from './ui/button'

function Profile() {
  const { isFetching, data } = useUser()
  return (
    <div>
      <Avatar>
        <AvatarImage></AvatarImage>
        <AvatarFallback></AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Profile
