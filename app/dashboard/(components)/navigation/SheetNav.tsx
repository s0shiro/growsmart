'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ToggleThemeButton from '@/components/MyComponents/shadcn/ToggleThemeButton'
import { usePathname, useRouter } from 'next/navigation'
import BreadcrumbSeparator from './BreadcrumbSeparator'
import { useQueryClient } from '@tanstack/react-query'
import { supabaseBrowser } from '@/utils/supabase/browser'
import NotificationIcon from '../ui/NotificationIcon'
import { useSession } from '@/stores/useSession'
import { getInitials } from '@/lib/utils'
import { LogOut, User } from 'lucide-react'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'

// Helper function to format breadcrumb segments
const formatPathname = (pathname: string): JSX.Element[] => {
  return pathname
    .replace(/^\//, '')
    .split('/')
    .map((segment, index, array) => (
      <span
        key={index}
        className={index === array.length - 1 ? 'foreground font-bold' : ''}
      >
        <Link href={`/${array.slice(0, index + 1).join('/')}`}>
          {segment.charAt(0).toUpperCase() + segment.slice(1)}
        </Link>
        {index < array.length - 1 && <BreadcrumbSeparator />}
      </span>
    ))
}

const SheetNav = () => {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const router = useRouter()
  const formattedPathname = formatPathname(pathname)
  const { user } = useSession()
  //TODO: Replace with useCurrentUserProfile hook
  const { data, error } = useCurrentUserProfile()

  const handleLogout = async () => {
    const supabase = supabaseBrowser()
    queryClient.clear()
    await supabase.auth.signOut()
    router.refresh()
    router.replace('/login')
  }

  return (
    <div className='flex items-center justify-between w-full'>
      {/* Breadcrumb Navigation */}
      <Breadcrumb className='hidden md:flex'>
        <BreadcrumbList>
          {formattedPathname.map((segment, index) => (
            <BreadcrumbItem key={index}>{segment}</BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right-aligned Section with User Actions */}
      <div className='flex items-center gap-4 ml-auto md:ml-0'>
        <NotificationIcon />
        <ToggleThemeButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='overflow-hidden rounded-full'
            >
              <Avatar className='h-9 w-9'>
                <AvatarImage
                  src={data?.avatar_url}
                  alt={user?.fullName || 'User'}
                  className='object-cover'
                />
                <AvatarFallback className='bg-muted'>
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={'/dashboard/profile'} className='flex items-center'>
                <User className='mr-2 h-4 w-4' />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className='flex items-center'
            >
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SheetNav
