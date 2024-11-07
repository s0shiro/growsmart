import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Member } from '@/lib/types'

export default function UserDetails({ user }: { user: Member }) {
  return (
    <div className='grid gap-4 py-4'>
      <div className='flex items-center space-x-4'>
        <Avatar className='w-20 h-20'>
          <AvatarImage
            src={user.users.avatar_url ?? '/images/default-avatar.png'}
            alt={user.users.full_name || 'User'}
            className='object-cover'
          />
          <AvatarFallback>{user.users.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className='font-semibold text-lg'>{user.users.full_name}</h3>
          <p className='text-sm text-muted-foreground'>{user.users.email}</p>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <p className='text-sm font-medium'>Role</p>
          <p className='text-sm text-muted-foreground'>{user.role}</p>
        </div>
        <div>
          <p className='text-sm font-medium'>Status</p>
          <p className='text-sm text-muted-foreground'>{user.status}</p>
        </div>
        <div>
          <p className='text-sm font-medium'>Joined</p>
          <p className='text-sm text-muted-foreground'>
            {new Date(user.created_at).toDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
