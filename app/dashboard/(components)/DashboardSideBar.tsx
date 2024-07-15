'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'

const links = [
  { route: '/dashboard', name: 'Home' },
  { route: '/dashboard/farmers', name: 'Farmers List' },
  { route: '/dashboard/planting', name: 'Record Planting' },
  { route: '/dashboard/harvests', name: 'Record Harvest' },
  { route: '/dashboard/damaged', name: 'Record Damaged Crops' },
]

function DashboardSideBar() {
  const pathname = usePathname()

  return (
    <div className='lg:block hidden border-r h-full'>
      <div className='flex h-full max-h-screen flex-col gap-2 '>
        <div className='flex h-[55px] items-center justify-between border-b px-3 w-full'>
          <Link className='flex items-center gap-2 font-semibold ml-1' href='/'>
            <span className=''>GrowSmart</span>
          </Link>
        </div>
        <div className='flex-1 overflow-auto py-2'>
          <nav className='grid items-start px-4 text-sm font-medium'>
            <div>
              {links.map((link) => (
                <div className='w-full' key={link.route}>
                  <Link
                    className={clsx(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                      {
                        'flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50':
                          pathname === link.route,
                      },
                    )}
                    href={link.route}
                  >
                    {/* <div className='border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-whi</div>te'>
                <HomeIcon className='h-3 w-3' />
              </div> */}
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>

            <Separator className='my-3' />
            <Link
              className={clsx(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                {
                  'flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50':
                    pathname === '/dashboard/settings',
                },
              )}
              href='/dashboard/settings'
              id='onboarding'
            >
              <div className='border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white'>
                <Settings className='h-3 w-3' />
              </div>
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default DashboardSideBar
