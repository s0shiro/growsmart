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
  TriangleAlert,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { capitalizeFirst, getInitials } from '@/lib/utils'

const technicianLinks = [
  { href: '/dashboard', Icon: Home, label: 'Overview' },
  { href: '/dashboard/myfarmers', Icon: Users2, label: 'My Farmers' },
]

const productionLinks = [
  { href: '/dashboard/+planting', Icon: Plus, label: 'Add Planting' },
  { href: '/dashboard/standing', Icon: ClipboardList, label: 'Standing Crops' },
  { href: '/dashboard/harvest', Icon: CheckSquare, label: 'Harvest Crops' },
  { href: '/dashboard/harvested', Icon: CheckCircle, label: 'Harvested Crops' },
  { href: '/dashboard/damages', Icon: TriangleAlert, label: 'Damages Report' },
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

export default function Sidebar({
  userSession,
  isOpen,
  onClose,
  isMobile,
}: {
  userSession: any
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}) {
  const role = userSession.role
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
        'bg-card flex flex-col h-screen transition-all duration-300 ease-in-out border-r border-border',
        isOpen ? 'w-64' : 'w-16',
        isMobile && 'fixed left-0 top-0 z-40',
        isMobile && !isOpen && '-translate-x-full',
      )}
    >
      <div className='flex items-center h-16 px-4 border-b border-border'>
        <div className='flex items-center'>
          <Image
            src='/no-bg.png'
            alt='Organization Logo'
            width={40}
            height={40}
            className='transition-all group-hover:scale-110 flex-shrink-0'
          />
          {isOpen && (
            <span className='text-xl font-semibold text-foreground ml-2 whitespace-nowrap'>
              GrowSmart
            </span>
          )}
        </div>
        {isMobile && (
          <Button variant='ghost' className='ml-auto' onClick={onClose}>
            <X className='h-6 w-6' />
          </Button>
        )}
      </div>
      <ScrollArea className='flex-1'>
        <nav className={clsx(isOpen ? 'px-4' : 'px-2', 'py-4')}>
          {links.map(({ href, Icon, label }) => (
            <TooltipProvider key={label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive(path, href) ? 'secondary' : 'ghost'}
                    className={clsx(
                      'w-full justify-start mb-2',
                      !isOpen && 'justify-center p-0',
                    )}
                    asChild
                  >
                    <Link href={href}>
                      <Icon className={clsx('h-4 w-4', isOpen && 'mr-2')} />
                      {isOpen && <span>{label}</span>}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side='right'>{label}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
          {role === 'technician' && (
            <>
              <Separator className='my-4' />
              <div
                className={clsx(
                  'text-sm font-medium text-muted-foreground mb-2',
                  !isOpen && 'sr-only',
                )}
              >
                Productions
              </div>
              {productionLinks.map(({ href, Icon, label }) => (
                <TooltipProvider key={label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive(path, href) ? 'secondary' : 'ghost'}
                        className={clsx(
                          'w-full justify-start mb-2',
                          !isOpen && 'justify-center p-0',
                        )}
                        asChild
                      >
                        <Link href={href}>
                          <Icon className={clsx('h-4 w-4', isOpen && 'mr-2')} />
                          {isOpen && <span>{label}</span>}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side='right'>{label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </>
          )}
          {role === 'admin' && (
            <>
              <Separator className='my-4' />
              <div
                className={clsx(
                  'text-sm font-medium text-muted-foreground mb-2',
                  !isOpen && 'sr-only',
                )}
              >
                Profiling
              </div>
              {profilingLinks.map(({ href, Icon, label }) => (
                <TooltipProvider key={label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive(path, href) ? 'secondary' : 'ghost'}
                        className={clsx(
                          'w-full justify-start mb-2',
                          !isOpen && 'justify-center p-0',
                        )}
                        asChild
                      >
                        <Link href={href}>
                          <Icon className={clsx('h-4 w-4', isOpen && 'mr-2')} />
                          {isOpen && <span>{label}</span>}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side='right'>{label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </>
          )}
          {(role === 'admin' || role === 'technician') && (
            <>
              <Separator className='my-4' />
              <div
                className={clsx(
                  'text-sm font-medium text-muted-foreground mb-2',
                  !isOpen && 'sr-only',
                )}
              >
                Reports
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        isActive(path, '/dashboard/reports')
                          ? 'secondary'
                          : 'ghost'
                      }
                      className={clsx(
                        'w-full justify-start mb-2',
                        !isOpen && 'justify-center p-0',
                      )}
                      asChild
                    >
                      <Link href='/dashboard/reports'>
                        <FileText
                          className={clsx('h-4 w-4', isOpen && 'mr-2')}
                        />
                        {isOpen && <span>Generate Reports</span>}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side='right'>
                      Generate Reports
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </nav>
      </ScrollArea>
      <div
        className={clsx('px-4 py-4 border-t border-border', !isOpen && 'px-2')}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                className={clsx(
                  'w-full justify-start mb-4',
                  !isOpen && 'justify-center p-0',
                )}
              >
                <Settings className={clsx('h-4 w-4', isOpen && 'mr-2')} />
                {isOpen && <span>Settings</span>}
              </Button>
            </TooltipTrigger>
            {!isOpen && <TooltipContent side='right'>Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        {isOpen && (
          <div className='flex items-center'>
            <div className='relative w-10 h-10'>
              <Avatar className='w-full h-full'>
                <AvatarImage
                  src={userSession?.avatarUrl ?? '/images/default-avatar.png'}
                  alt={userSession?.fullName || 'User'}
                  className='object-cover'
                />
                <AvatarFallback className='bg-muted'>
                  {getInitials(userSession?.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-semibold'>
                {userSession.fullName || 'User Name'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {capitalizeFirst(userSession?.jobTitle)}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
