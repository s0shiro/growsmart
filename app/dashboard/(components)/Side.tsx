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
  Settings,
  Users2,
  UserPlus,
  Megaphone,
  Building2,
  Sprout,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Image from 'next/image'

const technicianLinks = [
  { href: '/dashboard', Icon: Home, label: 'Overview' },
  { href: '/dashboard/inspection', Icon: LineChart, label: 'Inspection' },
  { href: '/dashboard/records', Icon: Package, label: 'Productions' },
  { href: '/dashboard/farmers', Icon: Users2, label: 'My Farmers' },
]

const adminLinks = [
  { href: '/dashboard', Icon: Home, label: 'Dashboard' },
  { href: '/dashboard/crops', Icon: Sprout, label: 'Crops' },
  { href: '/dashboard/create-user', Icon: UserPlus, label: 'Create User' },
  { href: '/dashboard/association', Icon: Building2, label: 'Associations' },
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
    'flex items-center gap-4 rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground p-2'
  const path = usePathname()

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background px-6 py-4 sm:flex'>
      <nav className='flex flex-col gap-4'>
        <Link href='/' className='group flex items-center gap-2 rounded-lg p-2'>
          <Image
            src='/logo.png'
            alt='Organization Logo'
            width={40}
            height={40}
            className='transition-all group-hover:scale-110'
          />
          <span className='text-xl font-semibold text-primary-foreground'>
            GrowSmart
          </span>
        </Link>

        {links.map(({ href, Icon, label }) => (
          <Link
            key={label}
            href={href}
            className={clsx(
              'flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground',
              isActive(path, href) && activeClass,
            )}
          >
            <Icon className='h-5 w-5' />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className='mt-auto flex flex-col items-center gap-4'>
        <Link
          href='#'
          className='flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground'
        >
          <Settings className='h-5 w-5' />
          <span>Settings</span>
        </Link>

        <div className='flex items-center gap-2 mt-8'>
          <Image
            src='https://i.pinimg.com/originals/7c/af/16/7caf16ffec532599adf6c6a9ee863754.jpg' // Replace with the actual path to the user's avatar
            alt='User Avatar'
            width={40}
            height={40}
            className='rounded-full'
          />
          <div>
            <p className='text-sm font-semibold text-primary-foreground'>
              {userSession?.user?.user_metadata?.name || 'User Name'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Side
