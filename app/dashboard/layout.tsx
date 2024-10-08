'use client'

import { useEffect, useState } from 'react'
import { readUserSession } from '@/lib/actions'
import SheetNav from './(components)/navigation/SheetNav'
import { redirect } from 'next/navigation'
import Side from './(components)/navigation/Side'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [userSession, setUserSession] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data } = await readUserSession()
      if (!data.user) {
        redirect('/login')
      }
      setUserSession(data)
    }

    fetchUserSession()
  }, [])

  if (!userSession) {
    return null // or a loading spinner
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <Side
        userSession={userSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Sticky header */}
        <div className='sticky top-0 z-10 bg-background border-b border-border'>
          <div className='flex items-center h-16 px-4'>
            <Button
              variant='ghost'
              className='lg:hidden mr-2'
              onClick={toggleSidebar}
            >
              <Menu className='h-6 w-6' />
            </Button>
            <SheetNav />
          </div>
        </div>

        {/* Scrollable content area */}
        <div className='flex-1 overflow-auto p-2'>
          <main className='bg-background rounded-lg mx-auto'>{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
