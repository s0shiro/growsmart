'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator as DefaultBreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ToggleThemeButton from '@/components/MyComponents/shadcn/ToggleThemeButton'
import { usePathname } from 'next/navigation'
import CustomBreadcrumbSeparator from './CustomBreadcrumbSeparator'

const formatPathname = (pathname: string) => {
  return pathname
    .replace(/^\//, '') // Remove leading slash
    .split('/') // Split by slashes
    .map((segment, index, array) => (
      <span
        key={index}
        className={index === array.length - 1 ? 'text-white font-bold' : ''}
      >
        <Link href={`/${array.slice(0, index + 1).join('/')}`}>
          {segment.charAt(0).toUpperCase() + segment.slice(1)}
        </Link>
        {index < array.length - 1 && <CustomBreadcrumbSeparator />}
      </span>
    )) // Capitalize each segment and add CustomBreadcrumbSeparator between segments
}

const SheetNav = () => {
  const pathname = usePathname()
  const formattedPathname = formatPathname(pathname)
  return (
    <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
      <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
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
                href='#'
                className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
              >
                <Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
                <span className='sr-only'>Acme Inc</span>
              </Link>
              <Link
                href='#'
                className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
              >
                <Home className='h-5 w-5' />
                Dashboard
              </Link>
              <Link
                href='#'
                className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
              >
                <ShoppingCart className='h-5 w-5' />
                Orders
              </Link>
              <Link
                href='#'
                className='flex items-center gap-4 px-2.5 text-foreground'
              >
                <Package className='h-5 w-5' />
                Products
              </Link>
              <Link
                href='#'
                className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
              >
                <Users2 className='h-5 w-5' />
                Customers
              </Link>
              <Link
                href='#'
                className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
              >
                <LineChart className='h-5 w-5' />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Breadcrumb className='hidden md:flex'>
          <BreadcrumbList>
            {formattedPathname.map((segment, index) => (
              <BreadcrumbItem key={index}>{segment}</BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className='relative ml-auto flex-1 md:grow-0'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search...'
            className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
          />
        </div>
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
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  )
}

export default SheetNav
