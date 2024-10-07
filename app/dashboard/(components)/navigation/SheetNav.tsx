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
              <Avatar>
                <AvatarImage
                  src='https://i.pinimg.com/originals/7c/af/16/7caf16ffec532599adf6c6a9ee863754.jpg'
                  alt='@shadcn'
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SheetNav
