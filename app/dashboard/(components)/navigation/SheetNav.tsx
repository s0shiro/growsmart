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
import { Loader2, LogOut, User } from 'lucide-react'
import { useCurrentUserProfile } from '@/hooks/users/useUserProfile'
import { useState } from 'react'
import LoadingDots from '../ui/LoadingDots'

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
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const supabase = supabaseBrowser()

      // Clear query cache first
      queryClient.clear()

      // Sign out from Supabase
      await supabase.auth.signOut()

      // Wait briefly to ensure signout completes
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Use replace instead of navigation chain
      router.replace('/login', { scroll: false })
    } catch (error) {
      console.error('Logout error:', error)
      // Reset loading state on error
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {isLoggingOut && (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 animate-spin' color='green' />
            <p className='text-green-500 flex items-center gap-0.5'>
              Logging out
              <LoadingDots color='text-green' />
            </p>
          </div>
        </div>
      )}

      <div
        className={`flex items-center justify-between w-full ${isLoggingOut ? 'pointer-events-none opacity-50' : ''}`}
      >
        <Breadcrumb className='hidden md:flex'>
          <BreadcrumbList>
            {formattedPathname.map((segment, index) => (
              <BreadcrumbItem key={index}>{segment}</BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className='flex items-center gap-4 ml-auto md:ml-0'>
          <NotificationIcon />
          <ToggleThemeButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoggingOut}>
              <Button
                variant='outline'
                size='icon'
                className='overflow-hidden rounded-full'
                disabled={isLoggingOut}
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
              <DropdownMenuLabel>
                {isLoggingOut ? 'Logging out...' : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                disabled={isLoggingOut}
                className={isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Link
                  href={'/dashboard/profile'}
                  className='flex items-center'
                  onClick={(e) => isLoggingOut && e.preventDefault()}
                >
                  <User className='mr-2 h-4 w-4' />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className='flex items-center'
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <LogOut className='mr-2 h-4 w-4' />
                )}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

export default SheetNav
