'use client'

import Link from 'next/link'
import {
  Home,
  Package,
  Settings,
  Users2,
  UserPlus,
  Megaphone,
  Building2,
  Sprout,
  ChevronRight,
  ClipboardList,
  CheckSquare,
  CheckCircle,
  User,
  UserCheck,
  Plus,
  FileText,
  X,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const technicianLinks = [
  { href: '/dashboard', Icon: Home, label: 'Overview' },
  { href: '/dashboard/myfarmers', Icon: Users2, label: 'My Farmers' },
]

const productionLinks = [
  { href: '/dashboard/+planting', Icon: Plus, label: 'Add Planting' },
  { href: '/dashboard/standing', Icon: ClipboardList, label: 'Standing Crops' },
  { href: '/dashboard/harvest', Icon: CheckSquare, label: 'Harvest Crops' },
  { href: '/dashboard/harvested', Icon: CheckCircle, label: 'Harvested Crops' },
]

const profilingLinks = [
  { href: '/dashboard/farmers', Icon: User, label: 'Farmers' },
  { href: '/dashboard/association', Icon: FileText, label: 'Associations' },
]

const adminLinks = [
  { href: '/dashboard', Icon: Home, label: 'Dashboard' },
  { href: '/dashboard/crops', Icon: Sprout, label: 'Crops' },
  { href: '/dashboard/users', Icon: UserPlus, label: 'Users' },
]

const defaultLinks = [
  { href: '/dashboard/announcement', Icon: Megaphone, label: 'Announcement' },
]

const isActive = (path: string, route: string) => {
  if (route === '/dashboard') {
    return path === '/dashboard'
  } else {
    return path === route || path.startsWith(route + '/')
  }
}

const Side = ({
  userSession,
  isOpen,
  onClose,
}: {
  userSession: any
  isOpen: boolean
  onClose: () => void
}) => {
  const role = userSession?.user?.user_metadata?.role
  const links =
    role === 'admin'
      ? adminLinks
      : role === 'technician'
        ? technicianLinks
        : defaultLinks

  const path = usePathname()

  return (
    <aside
      className={clsx(
        'w-64 bg-card flex flex-col h-screen overflow-y-auto transition-all duration-300 ease-in-out fixed lg:sticky top-0 left-0 z-40',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      )}
    >
      <div className='flex items-center h-16 px-4 border-b border-border'>
        <div className='flex items-center'>
          <Image
            src='/no-bg.png'
            alt='Organization Logo'
            width={40}
            height={40}
            className='transition-all group-hover:scale-110'
          />
          <span className='text-xl font-semibold text-foreground ml-2'>
            GrowSmart
          </span>
        </div>
        <Button variant='ghost' className='lg:hidden ml-auto' onClick={onClose}>
          <X className='h-6 w-6' />
        </Button>
      </div>
      <nav className='flex-1 px-4 py-4'>
        {links.map(({ href, Icon, label }) => (
          <Button
            key={label}
            variant={isActive(path, href) ? 'secondary' : 'ghost'}
            className='w-full justify-start mb-2'
            asChild
          >
            <Link href={href}>
              <Icon className='mr-2 h-4 w-4' />
              {label}
            </Link>
          </Button>
        ))}
        {role === 'technician' && (
          <>
            <Separator className='my-4' />
            <div className='font-semibold mb-2'>Productions</div>
            {productionLinks.map(({ href, Icon, label }) => (
              <Button
                key={label}
                variant={isActive(path, href) ? 'secondary' : 'ghost'}
                className='w-full justify-start mb-2'
                asChild
              >
                <Link href={href}>
                  <Icon className='mr-2 h-4 w-4' />
                  {label}
                </Link>
              </Button>
            ))}
          </>
        )}
        {role === 'admin' && (
          <>
            <Separator className='my-4' />
            <div className='font-semibold mb-2'>Profiling</div>
            {profilingLinks.map(({ href, Icon, label }) => (
              <Button
                key={label}
                variant={isActive(path, href) ? 'secondary' : 'ghost'}
                className='w-full justify-start mb-2'
                asChild
              >
                <Link href={href}>
                  <Icon className='mr-2 h-4 w-4' />
                  {label}
                </Link>
              </Button>
            ))}
          </>
        )}
      </nav>
      <div className='px-4 py-4 border-t border-border'>
        <Button variant='ghost' className='w-full justify-start mb-4'>
          <Settings className='mr-2 h-4 w-4' />
          Settings
        </Button>
        <div className='flex items-center'>
          <Image
            src='https://i.pinimg.com/originals/7c/af/16/7caf16ffec532599adf6c6a9ee863754.jpg'
            alt='User Avatar'
            width={40}
            height={40}
            className='rounded-full'
          />
          <div className='ml-3'>
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
