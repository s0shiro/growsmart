//SIDE.TSX

'use client'

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
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CheckSquare,
  CheckCircle,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

const technicianLinks = [
  { href: '/dashboard', Icon: Home, label: 'Overview' },
  { href: '/dashboard/farmers', Icon: Users2, label: 'My Farmers' },
]

const productionLinks = [
  {
    href: '/dashboard/inspection',
    Icon: ClipboardList,
    label: 'Inspection',
  },
  {
    href: '/dashboard/records',
    Icon: CheckSquare,
    label: 'Harvest',
  },
  {
    href: '/dashboard/harvested',
    Icon: CheckCircle,
    label: 'Harvested',
  },
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
  const [isProductionOpen, setProductionOpen] = useState(false)
  const role = userSession?.user?.user_metadata?.role
  const links =
    role === 'admin'
      ? adminLinks
      : role === 'technician'
        ? technicianLinks // Only technician links here
        : defaultLinks

  const activeClass =
    'flex items-center gap-4 rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground p-2'
  const path = usePathname()

  // Check if any of the production links are active
  const isAnyProductionActive = productionLinks.some(({ href }) =>
    isActive(path, href),
  )

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background px-6 py-4 sm:flex'>
      <nav className='flex flex-col gap-4'>
        <Link href='/' className='group flex items-center gap-2 rounded-lg'>
          <Image
            src='/no-bg.png'
            alt='Organization Logo'
            width={40}
            height={40}
            className='transition-all group-hover:scale-110'
          />
          <span className='text-xl font-semibold text-foreground'>
            GrowSmart
          </span>
        </Link>
        <Separator />

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

        {/*TODO:fix this don't use hardcoded role in this use .env or the constant */}
        {/* Productions Link */}
        {role === 'technician' && (
          <>
            <button
              onClick={() => setProductionOpen(!isProductionOpen)}
              className={clsx(
                'flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground w-full',
                isAnyProductionActive && activeClass, // Apply active state to the main "Productions" link
              )}
            >
              <Package className='h-5 w-5' />
              <span>Productions</span>
              {isProductionOpen ? (
                <ChevronDown className='ml-auto h-5 w-5' />
              ) : (
                <ChevronRight className='ml-auto h-5 w-5' />
              )}
            </button>

            {/* Productions Dropdown */}
            {isProductionOpen && (
              <div className='ml-6'>
                {productionLinks.map(({ href, Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className={clsx(
                      'flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground',
                      isActive(path, href) && activeClass, // Apply active state to individual production links
                    )}
                  >
                    <Icon className='h-4 w-4' />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </nav>

      {/* Settings and User Info */}
      <div className='mt-auto flex flex-col items-center'>
        <Link
          href='#'
          className='flex items-center gap-4 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground'
        >
          <Settings className='h-5 w-5' />
          <span>Settings</span>
        </Link>

        {/* User Avatar and Info */}
        <div className='flex items-center gap-2 mt-8'>
          <Image
            src='https://i.pinimg.com/originals/7c/af/16/7caf16ffec532599adf6c6a9ee863754.jpg'
            alt='User Avatar'
            width={40}
            height={40}
            className='rounded-full'
          />
          <div>
            <p className='text-sm font-semibold text-primary-foreground'>
              {userSession?.user?.user_metadata?.full_name || 'User Name'}
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
