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
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/dashboard', Icon: Home, label: 'Dashboard' },
  { href: '/dashboard/farmers', Icon: Users2, label: 'Farmers' },
  { href: '#', Icon: Package, label: 'Products' },
  { href: '#', Icon: Users2, label: 'Customers' },
  { href: '#', Icon: LineChart, label: 'Analytics' },
]

const isActive = (path: string, route: string) => {
  // all routes other than auth routes include "/dashboard"
  // so handle that first
  if (route === '/dashboard') {
    return path === '/dashboard'
  } else {
    return path.includes(route)
  }
}

const Side = () => {
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
