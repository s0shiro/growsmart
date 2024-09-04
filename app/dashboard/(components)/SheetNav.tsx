'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Home, LineChart, Package2, PanelLeft, Users2 } from 'lucide-react'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ToggleThemeButton from '@/components/MyComponents/shadcn/ToggleThemeButton'
import { usePathname, useRouter } from 'next/navigation'
import CustomBreadcrumbSeparator from './CustomBreadcrumbSeparator'
import { useQueryClient } from '@tanstack/react-query'
import { supabaseBrowser } from '@/utils/supabase/browser'

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
        {index < array.length - 1 && <CustomBreadcrumbSeparator />}
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
    <header className='sticky top-0 z-30 flex h-14 w-full items-center gap-4 border-b bg-background px-4 sm:h-auto sm:px-6'>
      {/* Sheet and Menu Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size='icon' variant='outline' className='sm:hidden'>
            <PanelLeft className='h-5 w-5' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='sm:max-w-xs'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='/'
              className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
            >
              <Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
              <span className='sr-only'>Acme Inc</span>
            </Link>
            <Link
              href='/dashboard'
              className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
            >
              <Home className='h-5 w-5' />
              Dashboard
            </Link>
            <Link
              href='/dashboard/farmers'
              className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
            >
              <Users2 className='h-5 w-5' />
              View and manage Farmers
            </Link>
            <Link
              href='/dashboard/records'
              className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
            >
              <LineChart className='h-5 w-5' />
              Manage Records
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Breadcrumb and Actions */}
      <div className='flex w-full items-center justify-between p-4 border-0'>
        {/* Breadcrumb Navigation */}
        <Breadcrumb className='hidden md:flex'>
          <BreadcrumbList>
            {formattedPathname.map((segment, index) => (
              <BreadcrumbItem key={index}>{segment}</BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Right-aligned Section with User Actions */}
        <div className='relative ml-auto flex items-center gap-4'>
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
                    src='https://github.com/shadcn.png'
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
    </header>
  )
}

export default SheetNav
