'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import Link from 'next/link'

import {
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  Users2,
  UserPlus,
  UserCheck,
  Megaphone,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const technicianLinks = [
  { href: '/dashboard', Icon: Home, label: 'Dashboard' },
  {
    href: '/dashboard/farmers',
    Icon: Users2,
    label: 'View and manage Farmers',
  },
  { href: '/dashboard/records', Icon: LineChart, label: 'Manage Records' },
]

const adminLinks = [
  { href: '/dashboard', Icon: Home, label: 'Dashboard' },
  { href: '/dashboard/create-user', Icon: UserPlus, label: 'Create User' },
  { href: '/dashboard/manage-users', Icon: UserCheck, label: 'Manage Users' },
]

const defaultLinks = [
  { href: '/dashboard/announcement', Icon: Megaphone, label: 'Announcement' },
]

const isActive = (path: string, route: string) => {
  if (route === '/dashboard') {
    return path === '/dashboard'
  } else {
    return path.includes(route)
  }
}

const Side = ({ userSession }: { userSession: any }) => {
  const role = userSession?.user?.user_metadata?.role
  const links =
    role === 'admin'
      ? adminLinks
      : role === 'technician'
        ? technicianLinks
        : defaultLinks

  const activeClass =
    'flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
  const path = usePathname()

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
      <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
        <Link
          href='/'
          className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
        >
          <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
          <span className='sr-only'>Acme Inc</span>
        </Link>
        <TooltipProvider>
          {links.map(({ href, Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={clsx(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive(path, href) && activeClass,
                  )}
                >
                  <Icon className='h-5 w-5' />
                  <span className='sr-only'>{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right'>{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
              >
                <Settings className='h-5 w-5' />
                <span className='sr-only'>Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}

export default Side
